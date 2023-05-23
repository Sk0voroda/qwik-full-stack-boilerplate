import { component$, useSignal } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';

import {
  type InitialValues,
  useForm,
  zodForm$,
  formAction$,
} from '@modular-forms/qwik';
import { z } from 'zod';
import { cx } from 'classix';

import Eye from '~/components/icons/Eye';
import ClosedEye from '~/components/icons/ClosedEye';
import { supabase } from '~/services';

const SignUpSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Please enter your email.')
      .email('The email address is badly formatted.'),
    password: z
      .string()
      .min(8, 'Password length should be at least 8 characters.'),
    repeatedPassword: z.string().min(8, 'Passwords should match.'),
  })
  .refine((data) => data.repeatedPassword === data.password, {
    message: 'Passwords should match.',
    path: ['repeatedPassword'],
  });

type SignUpForm = z.infer<typeof SignUpSchema>;

export const useFormAction = formAction$<SignUpForm>(async (values) => {
  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
  });

  if (error) {
    return {
      status: 'error',
      message: 'Server error',
    };
  }

  return {
    status: 'success',
    message: 'New account created.',
  };
}, zodForm$(SignUpSchema));

export const useFormLoader = routeLoader$<InitialValues<SignUpForm>>(() => ({
  email: '',
  password: '',
  repeatedPassword: '',
}));

export default component$(() => {
  const [signUpForm, { Form, Field }] = useForm<SignUpForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: zodForm$(SignUpSchema),
    validateOn: 'input',
    revalidateOn: 'input',
  });

  const showPassword = useSignal(false);

  return (
    <div class="mx-auto flex min-h-full w-80 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create new account
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form class="space-y-6">
          <Field name="email">
            {(field, props) => (
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div class="mt-2">
                  <input
                    {...props}
                    id="email"
                    type="email"
                    autoComplete="email"
                    class={`${cx(
                      field.error && 'text-red-500 focus:ring-red-500'
                    )} block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  />
                </div>
                {field.error && (
                  <span class="text-sm text-red-500">{field.error}</span>
                )}
              </div>
            )}
          </Field>

          <Field name="password">
            {(field, props) => (
              <div>
                <label
                  for="password"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div class="relative mt-2">
                  <input
                    {...props}
                    id="password"
                    type={showPassword.value ? 'text' : 'password'}
                    autoComplete="off"
                    class={` ${cx(
                      field.error && 'text-red-500 focus:ring-red-500'
                    )} block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  />
                  <div
                    onClick$={() => (showPassword.value = !showPassword.value)}
                    class="absolute bottom-0 right-0 top-0 mr-2 flex items-center hover:cursor-pointer"
                  >
                    {showPassword.value ? <Eye /> : <ClosedEye />}
                  </div>
                </div>
                {field.error && (
                  <span class="text-sm text-red-500">{field.error}</span>
                )}
              </div>
            )}
          </Field>

          <Field name="repeatedPassword">
            {(field, props) => (
              <div>
                <label
                  for="repeatedPassword"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Repeat password
                </label>
                <div class="relative mt-2">
                  <input
                    {...props}
                    id="repeatedPassword"
                    type={showPassword.value ? 'text' : 'password'}
                    autoComplete="off"
                    class={` ${cx(
                      field.error && 'text-red-500 focus:ring-red-500'
                    )} block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  />
                  <div
                    onClick$={() => (showPassword.value = !showPassword.value)}
                    class="absolute bottom-0 right-0 top-0 mr-2 flex items-center hover:cursor-pointer"
                  >
                    {showPassword.value ? <Eye /> : <ClosedEye />}
                  </div>
                </div>
                {field.error && (
                  <span class="text-sm text-red-500">{field.error}</span>
                )}
              </div>
            )}
          </Field>

          <div>
            <button
              type="submit"
              disabled={signUpForm.submitting}
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400"
            >
              Sign up
            </button>
          </div>
          {signUpForm.response.status === 'error' && (
            <div class="rounded-md border border-red-700 bg-red-200 p-4 text-red-500">
              <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Error:
              </h5>
              <p class="font-normal text-gray-700 dark:text-gray-400">
                {signUpForm.response.message}
              </p>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
});
