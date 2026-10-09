const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

function DetailItem({ label, children }) {
  return (
    <div className="flex flex-col gap-[0.5rem]">
      <span className="text-[0.75rem] font-semibold uppercase text-tx-gray">{label}</span>
      <span className="text-[0.875rem] font-semibold leading-[1.3]">{children}</span>
    </div>
  )
}

export default function MovieDetails({ movie }) {
  const { director, cast, runtimeMinutes, releaseDate, formats, fromPrice, ageRating } = movie

  return (
            <aside className="flex w-[30rem] flex-col gap-[1rem]">
                <h2 className="text-[1.25rem] font-extrabold">Details</h2>

                {director && <DetailItem label="Director">{director}</DetailItem>}
                {cast && <DetailItem label="Main cast">{cast}</DetailItem>}
                <DetailItem label="Duration">{runtimeMinutes} minutes</DetailItem>
                <DetailItem label="Release date">{formatDate(releaseDate)}</DetailItem>
                <DetailItem label="Formats">{formats.map((f) => f.name).join(', ')}</DetailItem>
                <DetailItem label="From">₾{fromPrice}</DetailItem>

                {ageRating && (
                  <div className="mt-[0.5rem] rounded-[0.75rem] bg-hc-orange/10 p-[1rem] text-hc-orange">
                    <p className="text-[0.75rem] font-semibold uppercase">Rating note</p>
                    <div className="mt-[0.5rem] flex gap-[0.5rem] text-[0.75rem]">
                      <span className="font-semibold">{ageRating.code}</span>
                      <p className="font-normal">{ageRating.description}</p>
                    </div>
                  </div>
                )}
            </aside>



    
  )
}



