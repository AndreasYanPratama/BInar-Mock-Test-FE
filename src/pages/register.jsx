import Link from 'next/link';
import { Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { withNoAuth } from '../layouts/auth/Auth';

const validationSchema = Yup.object({
  name   : Yup.string().required('nama kosong'),
  email   : Yup.string().required('email kosong').email(),
  password: Yup.string().required('password kosong').min(1),
});

const initialValues = {
  name    : '',
  email   : '',
  password: '',
};

function Register() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(['','']);

  async function handleOnSubmit(values){
    await doRegister(values);
  };

  const doRegister = async (payload) => {
    setLoading(true);
    try {
      const request = {
        "name": payload.name,
        "email": payload.email,
        "password": payload.password
      }
      const response = await fetch(`https://test-binar.herokuapp.com/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });
      const data = await response.json();
      console.log(response.status);
      console.log(data.result);
      
      // check apakah email sudah didaftarkan
      if(response.status == 200){
        if(data.result == null){
          setLoading(false);
          setMessage(['error',data.errors.email[0]]);
          console.log(data.errors.email[0]);
        }else{
          setLoading(false);
          setMessage(['success','Register Success'])
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
            Register
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
                  {/* alert jika gagal register */}
                  <div className="mb-2">
                    <div className={`${message[0] ? '' : 'hidden' }`}>
                      <div className={`${(message[0] == 'success') ? 'text-green-900 bg-green-400' : 'text-red-700 bg-red-100' } relative px-4 py-3 leading-normal rounded-lg`} role="alert">
                        {
                          (message[0] == 'success') ? 
                            (
                            <span className="absolute inset-y-0 left-0 flex items-center ml-4">
                              <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" className="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
                              </svg>
                            </span>
                            ) 
                          :
                            (
                            <span className="absolute inset-y-0 left-0 flex items-center ml-4">
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                            </span>
                            )
                        }
                        <p className="ml-6 capitalize">{message[1]}</p>
                      </div>
                    </div>
                  </div>
                  {/* form register */}
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-full px-3 mb-6">
                      <input 
                        className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" 
                        type='text' 
                        placeholder="Name"
                        name='name'
                        id='name'
                        onChange={handleChange}
                        onBlur={handleBlur} 
                        // required
                      />
                      <div className={`box-border ${touched.name && errors.name ? 'mb-2 text-red-500 text-sm font-bold block' : ''}`}>
                        {touched.name && errors.name && errors.name}
                      </div>
                    </div>
                    <div className="w-full md:w-full px-3 mb-6">
                      <input 
                        className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" 
                        type='email' 
                        placeholder="Email address"
                        name='email'
                        id='email'
                        onChange={handleChange}
                        onBlur={handleBlur} 
                          // required
                      />
                      <div className={`box-border ${touched.email && errors.email ? 'mb-2 text-red-500 text-sm font-bold block' : ''}`}>
                        {touched.email && errors.email && errors.email}
                      </div>
                    </div>
                    <div className="w-full md:w-full px-3 mb-6">
                        <input 
                          className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" 
                          type='password' 
                          placeholder="Password" 
                          name="password"
                          id="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          // required
                        />
                        <div className={`box-border ${touched.password && errors.password ? 'mb-2 text-red-500 text-sm font-bold block' : ''}`}>
                          {touched.password && errors.password && errors.password}
                        </div>
                    </div>
                    <div className="w-full md:w-full px-3 mb-6">
                        <button className="appearance-none block w-full bg-blue-600 text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-blue-500 focus:outline-none focus:bg-white focus:border-gray-500" disabled={loading}>
                          {/* Register */}
                          {loading ? 'Please wait...' : 'Register'}
                        </button>
                    </div>
                    <div className="mx-auto -mb-6 pb-1">
                        <span className="text-center text-xs text-gray-700">
                            Already have account?&nbsp;
                            <Link href="/">
                                <a className='text-blue-500'>Login</a>
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

  export default withNoAuth(Register);