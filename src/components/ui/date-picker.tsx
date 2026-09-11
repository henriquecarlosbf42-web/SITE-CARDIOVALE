"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDisplayDate(date: Date | null) {
  if (!date) return "";
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export interface DatePickerFieldProps {
  name: string;
  label?: string;
  defaultValue?: string | null;
  required?: boolean;
  withTime?: boolean;
  timeName?: string;
  defaultTime?: string | null;
  /** Opcional: usado quando o valor precisa alimentar estado de React
   * (ex: um wizard multi-etapa), além do input escondido do form. */
  onChange?: (isoDate: string) => void;
}

export function DatePickerField({
  name,
  label,
  defaultValue,
  withTime = false,
  timeName,
  defaultTime,
  onChange,
}: DatePickerFieldProps) {
  const [selected, setSelected] = useState<Date | null>(
    defaultValue ? new Date(`${defaultValue}T00:00:00`) : null,
  );

  const initialHour = defaultTime ? Number(defaultTime.split(":")[0]) : 9;
  const initialMinute = defaultTime ? Number(defaultTime.split(":")[1]) : 0;
  const [hours, setHours] = useState(pad(initialHour));
  const [minutes, setMinutes] = useState(pad(initialMinute));

  const browseBase = selected ?? new Date();
  const [open, setOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(browseBase.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(browseBase.getMonth());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const isoDate = selected
    ? `${selected.getFullYear()}-${pad(selected.getMonth() + 1)}-${pad(selected.getDate())}`
    : "";
  const time24 = `${pad(Number(hours || 0))}:${pad(Number(minutes || 0))}`;

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((year) => year - 1);
    } else {
      setCurrentMonth((month) => month - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((year) => year + 1);
    } else {
      setCurrentMonth((month) => month + 1);
    }
  }

  function selectDay(day: number) {
    const next = new Date(currentYear, currentMonth, day);
    setSelected(next);
    onChange?.(`${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`);
  }

  function handleHourChange(event: React.ChangeEvent<HTMLInputElement>) {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.slice(0, 2);
    if (Number(value) > 23) value = "23";
    setHours(value);
  }

  function handleMinuteChange(event: React.ChangeEvent<HTMLInputElement>) {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.slice(0, 2);
    if (Number(value) > 59) value = "59";
    setMinutes(value);
  }

  return (
    <div>
      <input type="hidden" name={name} value={isoDate} />
      {withTime && <input type="hidden" name={timeName ?? "time"} value={isoDate ? time24 : ""} />}

      {label && <label className="block text-sm font-medium text-ink-900">{label}</label>}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border border-ink-100 bg-white px-4 py-2.5 text-sm outline-none transition-colors hover:border-brand focus:border-brand ${label ? "mt-1.5" : ""}`}
      >
        <span className={selected ? "text-ink-900" : "text-ink-600"}>
          {selected ? `${formatDisplayDate(selected)}${withTime ? ` · ${hours}:${minutes}` : ""}` : "dd/mm/aaaa"}
        </span>
        <Calendar className="h-4 w-4 shrink-0 text-brand-deep" strokeWidth={1.75} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setOpen(false)} />

          <div className="relative w-[310px] overflow-hidden rounded-card border border-ink-100 bg-surface p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowMonthPicker((value) => !value)}
                className="flex items-center gap-1 text-base font-semibold text-brand-deep transition-opacity hover:opacity-75"
              >
                {MONTH_NAMES[currentMonth]} {currentYear}
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="rounded-full p-1.5 text-brand-deep transition-colors hover:bg-brand-light"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="rounded-full p-1.5 text-brand-deep transition-colors hover:bg-brand-light"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-y-1 text-center">
              {WEEKDAYS.map((day) => (
                <div key={day} className="text-[10px] font-bold tracking-wider text-ink-600">
                  {day}
                </div>
              ))}
            </div>

            <div className="relative mb-4 h-[216px]">
              <div className="absolute grid w-full grid-cols-7 justify-items-center gap-y-1">
                {Array.from({ length: firstDayIndex }, (_, index) => (
                  <div key={`empty-${index}`} className="h-9 w-9" />
                ))}
                {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
                  const isSelected =
                    selected?.getDate() === day &&
                    selected?.getMonth() === currentMonth &&
                    selected?.getFullYear() === currentYear;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => selectDay(day)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-medium transition-all ${
                        isSelected
                          ? "scale-105 bg-brand-deep font-semibold text-white shadow-md"
                          : "text-brand-deep hover:bg-brand-light"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {showMonthPicker && (
                <div className="absolute inset-0 z-10 flex flex-col rounded-2xl bg-surface/95 p-3 backdrop-blur">
                  <div className="mb-3 flex items-center justify-between border-b border-ink-100 pb-2">
                    <button
                      type="button"
                      onClick={() => setCurrentYear((year) => year - 1)}
                      className="rounded-full p-1.5 text-brand-deep transition-colors hover:bg-brand-light"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                    <span className="text-base font-bold text-ink-900">{currentYear}</span>
                    <button
                      type="button"
                      onClick={() => setCurrentYear((year) => year + 1)}
                      className="rounded-full p-1.5 text-brand-deep transition-colors hover:bg-brand-light"
                    >
                      <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="grid flex-1 grid-cols-3 gap-1.5 overflow-y-auto">
                    {MONTH_NAMES.map((month, index) => (
                      <button
                        key={month}
                        type="button"
                        onClick={() => {
                          setCurrentMonth(index);
                          setShowMonthPicker(false);
                        }}
                        className={`rounded-lg py-1.5 text-xs font-bold transition-colors ${
                          index === currentMonth
                            ? "bg-brand-deep text-white shadow-sm"
                            : "text-ink-900 hover:bg-brand-light"
                        }`}
                      >
                        {month.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {withTime && (
              <div className="flex items-center justify-between border-t border-ink-100 pt-4">
                <span className="text-sm font-semibold text-ink-900">Horário</span>

                <div className="flex items-center rounded-lg bg-surface-soft px-2 py-1 text-sm font-medium text-ink-900">
                  <input
                    type="text"
                    value={hours}
                    onChange={handleHourChange}
                    placeholder="00"
                    className="w-6 bg-transparent text-center font-semibold outline-none"
                  />
                  <span className="opacity-70">:</span>
                  <input
                    type="text"
                    value={minutes}
                    onChange={handleMinuteChange}
                    placeholder="00"
                    className="w-6 bg-transparent text-center font-semibold outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-full bg-brand-deep px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand"
            >
              Concluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
