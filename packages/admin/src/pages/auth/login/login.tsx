import React, { FC, useState } from 'react';

import { Button } from 'components/button';
import { InputField } from 'components/inputField';
import { State, Stateful, Switch } from 'components/stateful';
import { useService } from 'feret';
import {
  ErrorRow,
  FormHeader,
  FormRow,
  LoginLayout,
} from 'pages/shared/loginLayout';

import { Link } from 'react-router-dom';
import { RouterService } from 'services/RouterService';

import Spin from 'icons/circle-dashed.svg';
import { AuthStateManager } from 'services/AuthStateManager';

export const Login: FC = () => {
  const routerService = useService(RouterService);
  const authStateManager = useService(AuthStateManager);
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState<string[]>([]);

  return (
    <LoginLayout>
      <FormHeader title='Hello again' subtitle='please send us your details' />

      <div className='flex flex-col gap-4'>
        <InputField
          type='text'
          name='email'
          label='Email'
          placeholder='Enter email address'
          value={form}
          setValue={setForm}
        />

        <InputField
          type='password'
          name='password'
          label='Password'
          placeholder='enter password'
          value={form}
          setValue={setForm}
        />
        <FormRow className='text-slate-500'>
          <InputField
            name='remember'
            label='Remember for 30 days'
            type='checkbox'
            value={form}
            setValue={setForm}
          />
          <Link
            to={routerService.authRoutes.forgot}
            className='ml-auto text-blue-500'
          >
            Forgot password
          </Link>
        </FormRow>
        <Stateful
          before={() => setErrors([])}
          action={() =>
            authStateManager.login({
              email: form.email,
              password: form.password,
              remember: form.remember,
            })
          }
          finish={(err, response) =>
            err ? setErrors([err.message]) : response()
          }
        >
          {(provider) => (
            <Switch state={provider.state}>
              <State condition='none'>
                <Button onClick={provider.onClick}>Sign In</Button>
              </State>
              <State condition='loading'>
                <Button type='secondary' disabled>
                  <Spin className='animate-spin' />
                </Button>
              </State>
              <State condition='succeed'>
                <Button type='succeed' disabled>
                  Redirecting to dashboard...
                </Button>
              </State>
              <State condition='failed'>
                <Button type='danger' disabled>
                  Failed to login {':('}
                </Button>
              </State>
            </Switch>
          )}
        </Stateful>
        <ErrorRow errors={errors} />

        <FormRow className='text-slate-500'>
          <span>Don't have an account?</span>
          <Link to={routerService.authRoutes.signUp} className='text-blue-500'>
            Sign Up
          </Link>
        </FormRow>
      </div>
    </LoginLayout>
  );
};

export default Login;
