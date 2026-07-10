import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RiEyeLine, RiEyeOffLine, RiCheckboxCircleLine } from 'react-icons/ri'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import Spinner from '../components/common/Spinner'

/**
 * Login page — email/password form with JWT auth.
 */
export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required.'
    if (!form.password) errs.password = 'Password is required.'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const data = await authService.login(form)
      login(data.user, data.access_token)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = field => `
    w-full px-4 py-3 rounded-xl text-sm
    bg-white/5 border transition-all focus:outline-none focus:ring-2
    text-white placeholder:text-slate-500
    ${errors[field]
      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
      : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20'
    }
  `

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 items-center justify-center p-12">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-8 animate-pulse-glow">
            <RiCheckboxCircleLine className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Manage tasks<br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              effortlessly
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Stay organized, hit deadlines, and boost your productivity — all in one place.
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-3 text-left">
            {[
              'Smart task filtering & sorting',
              'Priority management system',
              'Real-time dashboard analytics',
              'Secure JWT authentication',
            ].map(f => (
              <div key={f} className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo for mobile */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
              <RiCheckboxCircleLine className="text-white text-xl" />
            </div>
            <p className="text-white font-bold text-xl">TaskFlow</p>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">Sign in</h2>
            <p className="text-slate-400 mt-2">Welcome back! Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} id="login-form" className="space-y-4">
            {/* General error */}
            {errors.general && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl">
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass('email')}
              />
              {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputClass('password') + ' pr-11'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Spinner size="sm" /> : null}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
