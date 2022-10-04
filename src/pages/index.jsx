import Link from 'next/link';
import { Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { withNoAuth } from '../layouts/auth/Auth';

const validationSchema = Yup.object({
  email   : Yup.string().required('email kosong').email(),
  password: Yup.string().required('password kosong').min(1),
});

const initialValues = {
  email   : '',
  password: '',
};

function Login() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleOnSubmit(values){
    await doLogin(values);
  };

  const doLogin = async (payload) => {
    setLoading(true);
    try {
      const request = {
        "email": payload.email,
        "password": payload.password
      }
      const response = await fetch(`https://test-binar.herokuapp.com/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });
      const data = await response.json();
      console.log(response.status);
      console.log(data.result);

      // check apakah akun salah
      if(response.status == 200){
        if(data.result == null){
          setLoading(false);
          setMessage('Login Failed');
        }else{
          localStorage.setItem('user', JSON.stringify(data.result));
          window.location.href = '/dashboard';
        }
      }else{
        console.log(response.status); 
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return(
    <div>
      <div className="text-center mt-20">
        <h2 className="text-4xl tracking-tight">
          Login
        </h2>
      </div>
      <div className="flex justify-center my-2 mx-4 md:mx-0">
        <Formik
          initialValues={initialValues}
          onSubmit={handleOnSubmit}
          validationSchema={validationSchema}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            touched,
            errors,
          }) => (
            <form className="w-full max-w-xl bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
                {/* alert jika gagal login */}
                <div className="mb-2">
                  <div className={`${message ? '' : 'hidden' } relative px-4 py-3 leading-normal text-red-700 bg-red-100 rounded-lg`} role="alert">
                    <span className="absolute inset-y-0 left-0 flex items-center ml-4">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                    </span>
                    <p className="ml-6">{message}</p>
                  </div>
                </div>
                {/* form login */}
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-full px-3 mb-6">
                      <input 
                        className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" 
                        type='email' 
                        placeholder="Email address"
                        name='email'
                        id='email'
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className={`box-border ${touched.email && errors.email ? 'mb-2 text-red-500 text-sm font-bold block' : ''}`}>
                        {touched.email && errors.email && errors.email}
                      </div>
                  </div>
                  <div className="w-full md:w-full px-3 mb-6">
                      <input 
                        className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" 
                        type='password'
                        name="password"
                        id="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Password"
                      />
                      <div className={`box-border ${touched.password && errors.password ? 'mb-2 text-red-500 text-sm font-bold block' : ''}`}>
                        {touched.password && errors.password && errors.password}
                      </div>
                  </div>
                  <div className="w-full md:w-full px-3 mb-6">
                      <button className="appearance-none block w-full bg-blue-600 text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-blue-500 focus:outline-none focus:bg-white focus:border-gray-500" disabled={loading}>
                        {/* Login */}
                        {loading ? 'Please wait...' : 'Login'}
                      </button>
                  </div>
                  <div className="mx-auto -mb-6 pb-1">
                      <span className="text-center text-xs text-gray-700">
                        Don&apos;t have an account?&nbsp;
                        <Link href="/register">
                          <a className='text-blue-500'>Register</a>
                        </Link>
                      </span>
                  </div>
                </div>
            </form>
          )}
        </Formik>

      </div>
    </div>
  )
}

export default withNoAuth(Login);