import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTenantURL(tenantSlug: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}`
}

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export function formatDeadline(min: number | null | undefined, max: number | null | undefined) {
  if(min && max){
    if(min === max){
      return `${max} ${numberToDays(max)}`
    } else {
      return `${min} - ${max} ${numberToDays(max)}`
    }
  }
  else if(min) {
    return `от ${min} ${limitedNumberToDay(min)}`
  } else if(max) {
    return `до ${max} ${limitedNumberToDay(max)}`
  }

  return "не указано"
}

function numberToDays(count: number){
  const lastTwoDigits = count % 100;
  if(lastTwoDigits > 5 && lastTwoDigits < 21){
    return "дней"
  }
  const lastDigit = count % 10;
  switch (true){
    case lastDigit === 0:
      return "дней";
    case lastDigit === 1:
      return "день";
    case lastDigit < 5:
      return "дня";
  }
  return "дней"
}

function limitedNumberToDay(count: number){
  const lastTwoDigits = count % 100;
  if(lastTwoDigits > 1 && lastTwoDigits < 21){
    return "дней"
  }
  const lastDigit = count % 10;
  switch (true){
    case lastDigit === 1:
      return "дня";
  }
  return "дней"
}