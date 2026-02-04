import { useRouteError } from "react-router-dom";

export default function ErrorComponent() {
    const error: unknown = useRouteError();

    return (
        <h1>{`${error}`}</h1>
    )
};