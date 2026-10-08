import SessionCard from "./SessionCard";

export default function MovieSessionRow({ movie }) {
    return (
        <div className="flex flex-col gap-y-[0.875rem] border-b border-bg-brighter pb-[1.5rem]">

            {/* Movie information */}
            <div className="flex items-center gap-[1rem] mb-[0.75rem]">

                {/* Poster */}
                <img
                    src={movie.movie.posterUrl}
                    alt={movie.movie.title}
                    className="w-[3.5rem] h-[5rem] rounded-[0.5rem] object-cover"
                />

                {/* Title + duration */}
                <div className="flex flex-col gap-[0.75rem]">

                    <div className="flex items-center gap-[0.75rem]">
                        <h2 className="font-extrabold text-[1.125rem]">
                            {movie.movie.title}
                        </h2>

                        {movie.movie.ageRating?.code && (
                            <span className="text-hc-red bg-tint-pink rounded-full px-[0.5rem] py-[0.25rem] text-[0.75rem] font-semibold">
                                {movie.movie.ageRating.code}
                            </span>
                        )}
                    </div>

                    <span className="text-tx-gray text-[0.875rem] font-normal">
                        {movie.movie.runtimeMinutes} min
                    </span>
                </div>
            </div>

            {/* Showtimes */}
            <div className="flex gap-[0.75rem] overflow-hidden">
                {movie.sessions.map((session) => (
                    <SessionCard
                        key={session.id}
                        session={session}
                    />
                ))}
            </div>
        </div>
    );
}