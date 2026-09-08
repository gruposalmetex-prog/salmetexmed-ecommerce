interface AdminFieldErrorProps {
  errors?: string[];
}

export function AdminFieldError({ errors }: AdminFieldErrorProps) {
  if (!errors?.length) {
    return null;
  }

  return (
    <div className="mt-2 space-y-1">
      {errors.map((error) => (
        <p key={error} className="text-xs font-medium text-red-600">
          {error}
        </p>
      ))}
    </div>
  );
}
