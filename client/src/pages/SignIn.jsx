import { useState } from 'react';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

function SignIn() {
  const [formData, setFormData] = useState({});
  const { isLoading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //! controlled inputs
  function handleChange(e) {
    setFormData((curr) => ({ ...curr, [e.target.id]: e.target.value.trim() }));
  }

  //! submit form
  async function handleSubmit(e) {
    e.preventDefault();

    //! validate form data
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill in all fields'));
    }

    //! get user
    try {
      dispatch(signInStart());

      const res = await fetch('/api/v1/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status !== 'success') {
        return dispatch(signInFailure(data.message));
      }

      const {
        data: { user },
      } = data;

      if (res.ok && res.status === 200) {
        dispatch(signInSuccess(user));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              DevSpeak
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is the DevSpeak blog. Please sign in to write your own posts.
            You can sign in with your email and password or with Google.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" value="Your email" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                autoComplete="off"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="password" value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone={'purpleToPink'}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don&apos;t have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
