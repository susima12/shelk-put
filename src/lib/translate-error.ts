// Преобразует ошибки Supabase / fetch в понятные русскоязычные сообщения.
// Используется во всех toast.error по проекту.
export function translateError(err: unknown, fallback = "Произошла ошибка. Попробуйте ещё раз."): string {
  const raw =
    typeof err === "string"
      ? err
      : (err as any)?.message ?? (err as any)?.error_description ?? "";
  const msg = String(raw).toLowerCase();

  if (!msg) return fallback;

  // Сетевые ошибки / прерванные запросы (часто появляются при выходе со страницы)
  if (
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("network error") ||
    msg.includes("load failed") ||
    msg.includes("aborted") ||
    msg.includes("the operation was aborted")
  ) {
    return "Нет связи с сервером. Проверьте интернет и попробуйте снова.";
  }

  // Аутентификация
  if (msg.includes("invalid login credentials")) return "Неверный email или пароль.";
  if (msg.includes("email not confirmed")) return "Email не подтверждён.";
  if (msg.includes("user already registered")) return "Пользователь с таким email уже зарегистрирован.";
  if (msg.includes("password should be at least")) return "Пароль слишком короткий.";
  if (msg.includes("invalid email")) return "Некорректный email.";
  if (msg.includes("rate limit") || msg.includes("too many")) return "Слишком много попыток. Подождите немного.";
  if (msg.includes("jwt") || msg.includes("not authenticated") || msg.includes("unauthorized")) {
    return "Сессия истекла. Войдите снова.";
  }
  if (msg.includes("token has expired")) return "Срок действия ссылки истёк.";

  // База данных / RLS
  if (msg.includes("duplicate key") || msg.includes("already exists")) return "Запись уже существует.";
  if (msg.includes("violates row-level security") || msg.includes("permission denied") || msg.includes("403")) {
    return "Недостаточно прав для этого действия.";
  }
  if (msg.includes("not found") || msg.includes("404")) return "Запись не найдена.";
  if (msg.includes("foreign key")) return "Связанная запись не найдена.";
  if (msg.includes("value too long")) return "Текст слишком длинный.";
  if (msg.includes("violates check constraint")) return "Введены недопустимые данные.";

  // Файлы
  if (msg.includes("payload too large") || msg.includes("file size")) return "Файл слишком большой.";
  if (msg.includes("invalid mime") || msg.includes("mime type")) return "Неподдерживаемый тип файла.";

  return fallback;
}

// true для ошибок, которые не нужно показывать пользователю (отмена/анмаунт).
export function isSilentError(err: unknown): boolean {
  const msg = String((err as any)?.message ?? err ?? "").toLowerCase();
  return (
    msg.includes("aborted") ||
    msg.includes("the operation was aborted") ||
    msg.includes("abort")
  );
}
