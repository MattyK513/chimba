import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { ActionFunctionArgs } from "react-router-dom";

export interface ParentComponentProps {
    children: ReactNode
}

export type { ActionFunctionArgs, Dispatch, ReactNode, SetStateAction };