import { useConfig } from "../../context/ConfigContext";
import { getNextDays } from "../../utils/dates";
import arrowDown from "../../assets/arrow.svg";
import { useSessionFilters } from "../../hooks/useSessionFilters";
import toggle from "../../utils/toggle";
import venueFormat from "../../utils/venueFormat";
import { getSessions } from "../../api/sessions";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Pagination from "./Pagination";
import SortDrop from "./SortDrop";

import MovieSessionRow from "./MovieSessionRow";


export default function Session() {



    const {
        venues,
        formats,
        languages,
        timeBands
    } = useConfig();

    const filters = useSessionFilters();


    /*
        Get sessions whenever filters change
    */
    const {
        data,
        isLoading,
        isError
    } = useQuery({
        queryKey: [
            "sessions",
            filters.venue,
            filters.format,
            filters.language,
            filters.band,
            filters.date,
            filters.sort,
            filters.page
        ],

        queryFn: () =>
            getSessions({
                venue: filters.venue,
                format: filters.format,
                language: filters.language,
                band: filters.band,
                date: filters.date,
                sort: filters.sort,
                page: filters.page
            }),

        placeholderData: keepPreviousData
    });

    



    /*
        Depending on your API, this might be:
        data.data
        or
        data.sessions

        Adjust this line to your actual response.
    */
    const movies = data?.data ?? [];


    return (
        <div className="flex container-page text-tx-white gap-x-[3.18rem]">

            {/* =====================================================
                LEFT SIDEBAR
            ====================================================== */}

            <div className="flex flex-col gap-y-[2.25rem] ">

                {/* Page title */}
                <div className="flex flex-col gap-y-[0.375rem]">

                    <h1 className="font-extrabold text-2xl">
                        Sessions
                    </h1>

                    <p className="text-tx-gray text-[0.875rem] font-normal">
                        Browse showtimes across all venues
                    </p>

                </div>


                {/* Filters */}
                <div className="bg-bg-medium w-[20rem] rounded-[1rem] p-[1.5rem] flex flex-col gap-y-[1.5rem] sticky top-3">

                    <h3 className="font-extrabold text-[1.125rem]">
                        Filters
                    </h3>


                    {/* ================= VENUE ================= */}

                    <div className="border-b pb-[1.5rem] border-bg-brighter">

                        <span className="font-semibold text-[0.75rem] text-tx-gray">
                            VENUE
                        </span>

                        <div className="flex flex-col gap-[0.35rem] mt-[0.5rem]">

                            {venues.map((v) => (

                                <label
                                    key={v.slug}
                                    className="flex items-center gap-[0.32rem]"
                                >

                                    <input
                                        type="checkbox"
                                        className="checkbox-custom"
                                        checked={filters.venue.includes(v.slug)}
                                        onChange={() =>
                                            filters.update({
                                                venue: toggle(
                                                    filters.venue,
                                                    v.slug
                                                )
                                            })
                                        }
                                    />

                                    <span className="font-semibold text-[0.875rem]">
                                        {v.name}
                                    </span>

                                    <span className="font-normal text-[0.75rem] text-tx-gray">
                                        {"• " + v.city}
                                    </span>

                                </label>

                            ))}

                        </div>

                    </div>


                    {/* ================= DATE ================= */}

                    <div className="border-b pb-[1.5rem] border-bg-brighter">

                        <span className="font-semibold text-[0.75rem] text-tx-gray">
                            DATE
                        </span>

                        <div className="flex items-center gap-[0.32rem] overflow-x-auto no-scrollbar mt-[0.5rem]">

                            {getNextDays().map((d) => {

                                const isSelected =
                                    d.value === filters.date;

                                return (
                                    <button
                                        key={d.value}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() =>
                                            filters.update({
                                                date: d.value
                                            })
                                        }
                                        className={`
                                            flex flex-col
                                            items-center
                                            justify-center
                                            gap-[0.32rem]
                                            py-[0.625rem]
                                            px-[0.375rem]
                                            w-[2.31rem]
                                            h-[3.37rem]
                                            rounded-[0.5rem]
                                            shrink-0
                                            font-semibold
                                            text-[0.75rem]

                                            ${
                                                isSelected
                                                    ? "bg-hc-red"
                                                    : "bg-bg-brighter"
                                            }
                                        `}
                                    >
                                        <span>{d.weekday}</span>
                                        <span>{d.day}</span>
                                    </button>
                                );

                            })}

                        </div>

                    </div>


                    {/* ================= FORMAT ================= */}

                    <div className="border-b pb-[1.5rem] border-bg-brighter">

                        <span className="font-semibold text-[0.75rem] text-tx-gray">
                            FORMAT
                        </span>

                        <div className="flex flex-col gap-[0.35rem] mt-[0.5rem]">

                            {(filters.venue.length > 0
                                ? venueFormat(
                                    venues,
                                    filters.venue
                                )
                                : formats
                            ).map((f) => (

                                <label
                                    key={f.slug}
                                    className="flex items-center gap-[0.32rem]"
                                >

                                    <input
                                        type="checkbox"
                                        className="checkbox-custom"
                                        checked={filters.format.includes(
                                            f.slug
                                        )}
                                        onChange={() =>
                                            filters.update({
                                                format: toggle(
                                                    filters.format,
                                                    f.slug
                                                )
                                            })
                                        }
                                    />

                                    <span className="font-semibold text-[0.875rem]">
                                        {f.name}
                                    </span>

                                </label>

                            ))}

                        </div>

                    </div>


                    {/* ================= LANGUAGE ================= */}

                    <div className="border-b pb-[1.5rem] border-bg-brighter">

                        <span className="font-semibold text-[0.75rem] text-tx-gray">
                            LANGUAGE
                        </span>

                        <div className="flex flex-col gap-[0.35rem] mt-[0.5rem]">

                            {languages.map((l) => (

                                <label
                                    key={l.slug}
                                    className="flex items-center gap-[0.32rem]"
                                >

                                    <input
                                        type="checkbox"
                                        className="checkbox-custom"
                                        checked={filters.language.includes(
                                            l.slug
                                        )}
                                        onChange={() =>
                                            filters.update({
                                                language: toggle(
                                                    filters.language,
                                                    l.slug
                                                )
                                            })
                                        }
                                    />

                                    <span className="font-semibold text-[0.875rem]">
                                        {l.name}
                                    </span>

                                </label>

                            ))}

                        </div>

                    </div>


                    {/* ================= TIME ================= */}

                    <div className="border-b pb-[1.5rem] border-bg-brighter">

                        <span className="font-semibold text-[0.75rem] text-tx-gray">
                            TIME OF DAY
                        </span>

                        <div className="flex flex-col gap-[0.35rem] mt-[0.5rem]">

                            {timeBands.map((t) => (

                                <label
                                    key={t.id}
                                    className="flex items-center gap-[0.32rem]"
                                >

                                    <input
                                        type="checkbox"
                                        className="checkbox-custom"
                                        checked={filters.band.includes(
                                            t.id
                                        )}
                                        onChange={() =>
                                            filters.update({
                                                band: toggle(
                                                    filters.band,
                                                    t.id
                                                )
                                            })
                                        }
                                    />

                                    <span className="font-semibold text-[0.875rem]">
                                        {t.label.split(" ")[0]}
                                    </span>

                                    <span className="font-normal text-[0.75rem] text-tx-gray">
                                        {"• " +
                                            t.label
                                                .split(" ")
                                                .slice(1)
                                                .join(" ")}
                                    </span>

                                </label>

                            ))}

                        </div>

                    </div>


                    {/* ================= CLEAR ================= */}

                    <div className="flex flex-col items-center gap-y-[0.75rem]">

                        {(
                            filters.language.length > 0 ||
                            filters.venue.length > 0 ||
                            filters.format.length > 0 ||
                            filters.band.length > 0
                        ) && (

                            <button
                                type="button"
                                onClick={() =>
                                    filters.update({
                                        venue: [],
                                        format: [],
                                        language: [],
                                        band: [],
                                        page: 1
                                    })
                                }
                                className="
                                    rounded-[99px]
                                    py-[9px]
                                    px-[12px]
                                    w-[17rem]
                                    border
                                    border-tx-gray
                                    font-semibold
                                    text-xs
                                "
                            >
                                Clear filters
                            </button>

                        )}

                        <p className="font-normal text-xs text-tx-gray">
                            {
                                filters.language.length +
                                filters.venue.length +
                                filters.format.length +
                                filters.band.length
                            } filters active
                        </p>

                    </div>

                </div>

            </div>


            {/* =====================================================
                RIGHT SIDE
            ====================================================== */}

            <div className="flex-1 mt-[5.5rem] min-w-0">

                {/* Header */}
                <div className="flex justify-between w-full mb-[1rem]">

                    <span className="font-semibold text-[0.875rem]">
                        Showing {data?.meta?.totalSessions} sessions
                    </span>


                    {/* Sort */}
                                     
                    <SortDrop value={filters.sort} onChange={(sort) => filters.update({ sort })} />



                </div>



                {/* =================================================
                    MOVIES
                ================================================= */}

                <div className="flex flex-col gap-y-[2rem]">

                    {isLoading && (
                        <div className="text-tx-gray text-sm">
                            Loading sessions...
                        </div>
                    )}


                    {isError && (
                        <div className="text-hc-red text-sm">
                            Failed to load sessions.
                        </div>
                    )}


                    {!isLoading &&
                        !isError &&
                        movies.map((m) => (

                            <MovieSessionRow
                                key={m.movie.id}
                                movie={m}
                            />

                        ))
                    }


                    {!isLoading &&
                        !isError &&
                        movies.length === 0 && (

                            <div className="py-10 text-center text-tx-gray">
                                No sessions found.
                            </div>

                        )
                    }

                </div>


                <Pagination filters={filters} lastPage={data?.meta?.lastPage} />

            

            </div>
            

        </div>
    );
}