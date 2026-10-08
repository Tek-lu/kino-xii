import { useSearchParams } from "react-router";
import { getNextDays } from "../utils/dates";

export function useSessionFilters() {
    // 1. Grab both searchParams and setSearchParams
    const [searchParams, setSearchParams] = useSearchParams();

    // --- PARSING URL PARAMS INTO USABLE VALUES ---
    const venueParam = searchParams.get("venue"); 
    const venue = venueParam ? venueParam.split(",") : [];

    const formatParam = searchParams.get("format");
    const format = formatParam ? formatParam.split(",") : [];

    const languageParam = searchParams.get("language");
    const language = languageParam ? languageParam.split(",") : [];

    const bandParam = searchParams.get("band");
    const band = bandParam ? bandParam.split(",") : [];

    const dateParam = searchParams.get("date");
    const date = dateParam ? dateParam : getNextDays(1)[0].value ;

    const sortParam = searchParams.get("sort");
    const sort = sortParam ? sortParam : "time_asc";

    const pageParam = searchParams.get("page");
    const page = Number(pageParam) || 1;

    const update = (patch) => {
        const newParams = new URLSearchParams(searchParams);

        Object.entries(patch).forEach(([key, value]) => {
            if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
                newParams.delete(key); 
            } else if (Array.isArray(value)) {
                newParams.set(key, value.join(",")); 
            } else {
                newParams.set(key, value); 
            }
        });

        // Reset page to 1 unless the patch explicitly includes a page change
        if (!("page" in patch)) {
            newParams.set("page", "1");
        }

        setSearchParams(newParams);
    };

    return { venue, format, language, band, date, sort, page, update };
}