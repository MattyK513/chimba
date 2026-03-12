import { useRouteError } from "react-router-dom";

export default function ErrorComponent() {
    const error: unknown = useRouteError();

    return (
        <pre>{JSON.stringify(error, null, 2)}</pre>
    )
};