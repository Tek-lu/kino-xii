import RedTicket from "../../assets/red_ticket.svg";
import GreenTicket from "../../assets/green_ticket.svg";
import { useBooking } from "../../context/bookingContext";
import { hasStarted } from "../../utils/booking";

export default function SessionCard({ session, blocked = false, reason }) {
    const { openBooking } = useBooking();

    const seatsLeft = session.seatsLeft ?? 0;
    const soldOut = session.isSoldOut || seatsLeft === 0;
    const started = hasStarted(session); // server clock is 4h late, so check locally
    const disabled = soldOut || started || blocked;

    const title = started
        ? "This session has already started"
        : blocked
          ? reason
          : soldOut
            ? "Sold out"
            : undefined;

    return (
        <button
            type="button"
            disabled={disabled}
            title={title}
            onClick={() => openBooking(session.id)}
            className={`
                shrink-0 w-[15.75rem] h-[6.5rem]
                rounded-[1rem]
                bg-bg-medium
                p-[1rem]
                flex flex-col justify-between
                text-left
                transition-opacity hover:opacity-90
                ${disabled ? "opacity-40" : ""}
            `}
        >
            {/* Top row */}
            <div className="flex w-full items-center justify-between gap-2">
                <span className="font-extrabold text-[1.125rem]">
                    {session.time}
                </span>

                <span className="bg-bg-brighter rounded-full px-[0.625rem] py-[0.31rem] text-[0.75rem] font-semibold whitespace-nowrap">
                    {session.format?.name}
                </span>
            </div>

            {/* Language + seats */}
            <div className="flex w-full items-center justify-between gap-2">
                <span className="text-tx-gray text-[0.75rem] whitespace-nowrap">
                    {session.language?.name.split(" ").includes("Subtitles")
                        ? `${session.language?.name.split(" ")[0]} + Subtitles`
                        : session.language?.name}
                </span>

                {started ? (
                    <span className="text-tx-gray text-[0.75rem]">Started</span>
                ) : soldOut ? (
                    <span className="text-tx-gray text-[0.75rem]">Sold out</span>
                ) : (
                    <span
                        className={`
                            text-[0.75rem] whitespace-nowrap flex gap-1
                            ${seatsLeft <= 5 ? "text-hc-red" : "text-hc-green"}
                        `}
                    >
                        <img
                            src={seatsLeft <= 5 ? RedTicket : GreenTicket}
                            alt=""
                            aria-hidden="true"
                            className="h-[0.75rem] w-[0.75rem]"
                        />
                        {seatsLeft} left
                    </span>
                )}
            </div>

            {/* Venue + price */}
            <div className="flex w-full items-center justify-between gap-2">
                <span className="text-tx-white text-[0.75rem] font-semibold truncate">
                    {session.venue?.name} · {session.hall?.name}
                </span>

                <span className="text-tx-white text-[0.875rem] font-extrabold whitespace-nowrap">
                    ₾{session.price}
                </span>
            </div>
        </button>
    );
}