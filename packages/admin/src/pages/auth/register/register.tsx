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
import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';

import Spin from 'icons/circle-dashed.svg';
import { AuthStateManager } from 'services/AuthStateManager';
import { RouterService } from 'services/RouterService';

export const Register: FC = () => {
  const routerService = useService(RouterService);
  const authStateManager = useService(AuthStateManager);
  const [errors, setErrors] = useState<string[]>([]);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  return (
    <LoginLayout>
      <FormHeader
        title="You're new here!"
        subtitle='Welcome, create an account'
      />

      <div className='flex flex-col gap-4'>
        <InputField
          type='text'
          name='fullName'
          label='Full Name'
          placeholder='Enter full name'
          value={form}
          setValue={setForm}
        />
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

        <ErrorRow errors={errors} />
        <Stateful
          before={() => setErrors([])}
          action={() =>
            authStateManager.register({
              name: form.fullName,
              email: form.email,
              password: form.password,
            })
          }
          finish={(err, response) =>
            err ? setErrors([err.message]) : response()
          }
        >
          {(provider) => (
            <Switch state={provider.state}>
              <State condition='none'>
                <Button onClick={provider.onClick}>Sign Up</Button>
              </State>
              <State condition='loading'>
                <Button disabled>
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
                  Failed to sign up {':('}
                </Button>
              </State>
            </Switch>
          )}
        </Stateful>

        <FormRow className='text-slate-500'>
          <span>Already have an account?</span>
          <Link to={routerService.authRoutes.login} className='text-blue-500'>
            Sign In
          </Link>
        </FormRow>
      </div>
    </LoginLayout>
  );
};

export default Register;
