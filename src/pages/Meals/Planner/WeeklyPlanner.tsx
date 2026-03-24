import { useEffect, useMemo, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useMeals from "../../../hooks/useMeals";
import type { MealPlanDay } from "../../../types";
import styles from "../Meals.module.css";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DEFAULT_DAY_PLAN: MealPlanDay = {
    breakfast: null,
    lunch: null,
    dinner: null,
    snack: null
};

const plannerSlots: Array<keyof MealPlanDay> = ["breakfast", "lunch", "dinner", "snack"];

function addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * DAY_IN_MS);
}

function normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDateKey(date: Date): string {
    return [
        String(date.getDate()).padStart(2, "0"),
        String(date.getMonth() + 1).padStart(2, "0"),
        date.getFullYear()
    ].join("-");
}

function formatDateLabel(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(date);
}

function formatSlotLabel(slot: keyof MealPlanDay): string {
    return slot.charAt(0).toUpperCase() + slot.slice(1);
}

function isDesktopWidth(width: number): boolean {
    return width >= 900;
}

function getWeekStart(date: Date): Date {
    const normalized = normalizeDate(date);
    const day = normalized.getDay();
    const distanceFromMonday = (day + 6) % 7;
    return addDays(normalized, -distanceFromMonday);
}

function getMealsForDate(mealPlans: ReturnType<typeof useMeals>["mealPlans"], date: Date): MealPlanDay {
    const dateData = mealPlans?.[formatDateKey(date)];
    return dateData ?? DEFAULT_DAY_PLAN;
}

interface DayCardProps {
    date: Date;
    dayPlan: MealPlanDay;
    editingKey: string | null;
    draftValue: string;
    setDraftValue: (value: string) => void;
    onStartEdit: (dateKey: string, slot: keyof MealPlanDay, currentLabel: string | null) => void;
    onCancelEdit: () => void;
    onSave: (dateKey: string, slot: keyof MealPlanDay) => Promise<void>;
    onRemove: (dateKey: string, slot: keyof MealPlanDay) => Promise<void>;
}

function DayCard({
    date,
    dayPlan,
    editingKey,
    draftValue,
    setDraftValue,
    onStartEdit,
    onCancelEdit,
    onSave,
    onRemove
}: DayCardProps) {
    const dateKey = formatDateKey(date);

    return (
        <article className={styles.dayCard}>
            <h3 className={styles.dayTitle}>{formatDateLabel(date)}</h3>
            <ul className={styles.dayMealList}>
                {plannerSlots.map((slot) => {
                    const slotKey = `${dateKey}:${slot}`;
                    const isEditing = editingKey === slotKey;
                    const currentLabel = dayPlan[slot]?.recipeLabel ?? null;

                    return (
                        <li key={slot} className={styles.dayMealItem}>
                            <span className={styles.dayMealType}>{formatSlotLabel(slot)}</span>

                            {isEditing ? (
                                <div className={styles.mealEditorRow}>
                                    <input
                                        value={draftValue}
                                        onChange={(event) => setDraftValue(event.target.value)}
                                        placeholder={`Add ${slot} meal`}
                                        className={styles.mealEditorInput}
                                    />
                                    <div className={styles.mealEditorActions}>
                                        <button type="button" onClick={() => onSave(dateKey, slot)}>Save</button>
                                        <button type="button" onClick={onCancelEdit}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.mealDisplayRow}>
                                    <span>{currentLabel ?? "No meal planned"}</span>
                                    <div className={styles.mealActions}>
                                        <button
                                            type="button"
                                            onClick={() => onStartEdit(dateKey, slot, currentLabel)}
                                        >
                                            {currentLabel ? "Edit" : "Add"}
                                        </button>
                                        {currentLabel && (
                                            <button type="button" onClick={() => onRemove(dateKey, slot)}>
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </article>
    );
}

export default function WeeklyPlanner() {
    const { user } = useAuth();
    const { mealPlans, setMeal } = useMeals();
    const [focusedDate, setFocusedDate] = useState<Date>(() => normalizeDate(new Date()));
    const [desktopView, setDesktopView] = useState<boolean>(() => isDesktopWidth(window.innerWidth));
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [draftValue, setDraftValue] = useState("");

    if (!user) {
        return null;
    }

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 900px)");
        const handleMediaChange = (event: MediaQueryListEvent) => {
            setDesktopView(event.matches);
        };

        setDesktopView(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleMediaChange);

        return () => {
            mediaQuery.removeEventListener("change", handleMediaChange);
        };
    }, []);

    const weekDates = useMemo(() => {
        const weekStart = getWeekStart(focusedDate);
        return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
    }, [focusedDate]);

    const singleDayPlan = getMealsForDate(mealPlans, focusedDate);

    const handleStartEdit = (dateKey: string, slot: keyof MealPlanDay, currentLabel: string | null) => {
        setEditingKey(`${dateKey}:${slot}`);
        setDraftValue(currentLabel ?? "");
    };

    const handleCancelEdit = () => {
        setEditingKey(null);
        setDraftValue("");
    };

    const handleSave = async (dateKey: string, slot: keyof MealPlanDay) => {
        const trimmed = draftValue.trim();

        if (!trimmed) {
            await setMeal(user.uid, dateKey, { [slot]: null });
        } else {
            await setMeal(user.uid, dateKey, { [slot]: { recipeLabel: trimmed } });
        }

        handleCancelEdit();
    };

    const handleRemove = async (dateKey: string, slot: keyof MealPlanDay) => {
        await setMeal(user.uid, dateKey, { [slot]: null });
    };

    return (
        <section className={styles.plannerSection}>
            <header className={styles.plannerNav}>
                <button
                    type="button"
                    onClick={() => setFocusedDate((prevDate) => addDays(prevDate, desktopView ? -7 : -1))}
                    aria-label={desktopView ? "View previous week" : "View previous day"}
                >
                    ←
                </button>
                <p className={styles.focusedDateLabel}>
                    {desktopView
                        ? `${formatDateLabel(weekDates[0])} – ${formatDateLabel(weekDates[6])}`
                        : formatDateLabel(focusedDate)}
                </p>
                <button
                    type="button"
                    onClick={() => setFocusedDate((prevDate) => addDays(prevDate, desktopView ? 7 : 1))}
                    aria-label={desktopView ? "View next week" : "View next day"}
                >
                    →
                </button>
            </header>

            {desktopView ? (
                <div className={styles.weekGrid}>
                    {weekDates.map((date) => {
                        const dayPlan = getMealsForDate(mealPlans, date);
                        return (
                            <DayCard
                                key={formatDateKey(date)}
                                date={date}
                                dayPlan={dayPlan}
                                editingKey={editingKey}
                                draftValue={draftValue}
                                setDraftValue={setDraftValue}
                                onStartEdit={handleStartEdit}
                                onCancelEdit={handleCancelEdit}
                                onSave={handleSave}
                                onRemove={handleRemove}
                            />
                        );
                    })}
                </div>
            ) : (
                <DayCard
                    date={focusedDate}
                    dayPlan={singleDayPlan}
                    editingKey={editingKey}
                    draftValue={draftValue}
                    setDraftValue={setDraftValue}
                    onStartEdit={handleStartEdit}
                    onCancelEdit={handleCancelEdit}
                    onSave={handleSave}
                    onRemove={handleRemove}
                />
            )}
        </section>
    );
}
