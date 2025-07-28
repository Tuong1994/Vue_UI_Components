import * as yup from 'yup'
import {
  PHONE_REGEX,
  REPLACE_MAX_NUM_REGEX,
  REPLACE_MIN_NUM_REGEX,
  WHITE_SPACE_REGEX
} from '@/common/constant/regex'
import type { FormRule } from '@/components/Control/type'
import useLangStore from '@/stores/LangStore'

const useFormRule = () => {
  const t = useLangStore()

  const rule = t.lang.common.form.rule

  const requiredString = (message?: string): FormRule => yup.string().required(message ?? rule.required)

  const requiredNumber = (message?: string): FormRule => yup.string().required(message ?? rule.required)

  const email = (): FormRule =>
    yup.string().required(rule.required).matches(WHITE_SPACE_REGEX, rule.whiteSpace).email(rule.email)

  const password = (minLength = 6, maxLength = 20): FormRule =>
    yup
      .string()
      .required(rule.required)
      .matches(WHITE_SPACE_REGEX, rule.whiteSpace)
      .min(minLength, rule.minLength.replace(REPLACE_MIN_NUM_REGEX, String(minLength)))
      .max(maxLength, rule.maxLength.replace(REPLACE_MAX_NUM_REGEX, String(maxLength)))

  const phone = (): FormRule =>
    yup
      .string()
      .required(rule.required)
      .matches(WHITE_SPACE_REGEX, rule.whiteSpace)
      .matches(PHONE_REGEX, rule.phone)

  const minNumber = (min: number): FormRule =>
    yup
      .number()
      .typeError(rule.number)
      .required(rule.required)
      .min(min, rule.min.replace(REPLACE_MIN_NUM_REGEX, String(min)))

  const maxNumber = (max: number): FormRule =>
    yup
      .number()
      .typeError(rule.number)
      .required(rule.required)
      .max(max, rule.min.replace(REPLACE_MAX_NUM_REGEX, String(max)))

  const match = (match: string | number, message?: string): FormRule =>
    yup.lazy(() => {
      if (typeof match === 'string')
        return yup
          .string()
          .typeError(rule.match)
          .oneOf([match], message ?? rule.match)
      if (typeof match === 'number')
        return yup
          .number()
          .typeError(rule.match)
          .oneOf([match], message ?? rule.match)
      return yup.mixed().test({
        name: 'match',
        message: rule.match,
        test: () => false
      })
    })

  return { requiredString, requiredNumber, minNumber, maxNumber, email, password, phone, match, yup }
}

export default useFormRule
