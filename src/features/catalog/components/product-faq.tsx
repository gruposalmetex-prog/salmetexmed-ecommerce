import { Plus } from "lucide-react";

const frequentlyAskedQuestions = [
  {
    question: "¿Cuándo enviarán mi pedido?",
    answer:
      "Una vez confirmado el pago y la disponibilidad del producto, nuestro equipo te informará la fecha estimada de envío. También compartiremos los datos de seguimiento cuando estén disponibles. El plazo puede variar según el producto y el destino.",
  },
  {
    question: "¿Puedo devolver mi producto?",
    answer:
      "Las devoluciones están sujetas a las condiciones del producto y a nuestra política vigente. Antes de enviar cualquier artículo, contacta a nuestro equipo para revisar tu caso y recibir las instrucciones correspondientes.",
  },
  {
    question:
      "¿Qué puedo hacer si mi artículo (o parte de él) está dañado?",
    answer:
      "Conserva el producto y su empaque, toma fotografías del daño y contáctanos lo antes posible indicando tu número de pedido y las piezas afectadas. Revisaremos el caso y te indicaremos el proceso correspondiente.",
  },
] as const;

export function ProductFaq() {
  return (
    <section
      aria-labelledby="product-faq-title"
      className="mt-16 border-t border-slate-200 pt-12 "
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
          Soporte
        </p>

        <h2
          id="product-faq-title"
          className="mt-2 text-2xl font-semibold tracking-tight text-slate-950"
        >
          Preguntas frecuentes
        </h2>

        <div className="mt-8 border-t border-slate-200">
          {frequentlyAskedQuestions.map((faq) => (
            <details
              key={faq.question}
              className="group border-b border-slate-200"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-base font-semibold text-slate-950 transition hover:text-sky-700 [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>

                <Plus
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 text-sky-800 transition-transform duration-200 group-open:rotate-45"
                />
              </summary>

              <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}