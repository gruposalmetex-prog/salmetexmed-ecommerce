"use client";

import {
  useActionState,
} from "react";
import {
  LoaderCircle,
  Send,
} from "lucide-react";

import {
  publishAdminProductAction,
  type PublishAdminProductState,
} from "../actions/publish-admin-product.action";

interface PublishAdminProductFormProps {
  productId: string;
  canPublish: boolean;
}

const initialState:
  PublishAdminProductState = {
    status: "idle",
  };

export function PublishAdminProductForm({
  productId,
  canPublish,
}: PublishAdminProductFormProps) {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    publishAdminProductAction,
    initialState,
  );

  return (
    <form action={formAction}>
      <input
        type="hidden"
        name="productId"
        value={productId}
      />

      {state.status === "error" && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-red-800">
            No fue posible publicar
          </p>

          <p className="mt-1 text-sm text-red-700">
            {state.message}
          </p>

          {state.missingRequirements &&
            state.missingRequirements.length >
              0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
                {state.missingRequirements.map(
                  (requirement) => (
                    <li key={requirement}>
                      {requirement}
                    </li>
                  ),
                )}
              </ul>
            )}
        </div>
      )}

      <button
        type="submit"
        disabled={
          pending ||
          !canPublish
        }
        className="inline-flex cursor-pointer h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
      >
        {pending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Publicando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Publicar producto
          </>
        )}
      </button>
    </form>
  );
}