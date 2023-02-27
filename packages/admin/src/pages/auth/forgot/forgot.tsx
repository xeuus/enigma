import React, { FC, useState } from 'react';

import { Button } from 'components/button';
import { InputField } from 'components/inputField';
import { useService } from 'feret';
import { FormHeader, FormRow, LoginLayout } from 'pages/shared/loginLayout';
import { Link } from 'react-router-dom';
import { RouterService } from 'services/RouterService';

export const Forgot: FC = () => {
  const routerService = useService(RouterService);

  const [form, setForm] = useState({
    email: '',
  });
  return (
    <LoginLayout>
      <FormHeader
        title='Forgot password?'
        subtitle='Enter your email, we send you the instructions.'
      />

      <div className='flex flex-col gap-4'>
        <InputField
          type='text'
          name='email'
          label='Email'
          placeholder='Enter email address'
          value={form}
          setValue={setForm}
        />
        <Button className='mt-4'>Request</Button>
        <FormRow className='text-slate-500'>
          <span>You lost?</span>
          <Link to={routerService.authRoutes.login} className='text-blue-500'>
            Get me out of here
          </Link>
        </FormRow>
      </div>
    </LoginLayout>
  );
};

export default Forgot;
