import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';

import {
  type InitialValues,
  useForm,
  zodForm$,
  formAction$,
} from '@modular-forms/qwik';
import { z } from 'zod';
import { cx } from 'classix';

import { supabase } from '~/services';

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter your email.')
    .email('The email address is badly formatted.'),
  password: z.string().min(1, 'Please enter your password.'),
});

type LoginForm = z.infer<typeof LoginSchema>;

export const useFormAction = formAction$<LoginForm>(async (values, event) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }

  throw event.redirect(301, '/');
}, zodForm$(LoginSchema));

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  email: '',
  password: '',
}));

export default component$(() => {
  const [, { Form, Field }] = useForm<LoginForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: zodForm$(LoginSchema),
    validateOn: 'input',
  });

  return (
    <div class="mx-auto flex min-h-full w-80 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
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
                    id="email"
                    type="email"
                    autoComplete="email"
                    class={`${cx(
                      field.error && 'text-red-500 focus:ring-red-500'
                    )} block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                    {...props}
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
                <div class="flex items-center justify-between">
                  <label
                    for="password"
                    class="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div class="text-sm">
                    <a
                      href="#"
                      class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div class="mt-2">
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    class={` ${cx(
                      field.error && 'text-red-500 focus:ring-red-500'
                    )} block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                    {...props}
                  />
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
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
});
