import { Link } from 'react-router-dom'

export default function Section({ title, to, children }) {
  return (
    <section className="container-page mt-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[20px] font-extrabold uppercase">{title}</h2>
        {to && (
          <Link to={to} className="text-[12px] font-semibold text-hc-red hover:underline">
            See all
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}