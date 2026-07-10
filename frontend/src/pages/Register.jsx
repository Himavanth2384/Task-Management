import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RiEyeLine, RiEyeOffLine, RiCheckboxCircleLine } from 'react-icons/ri'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import Spinner from '../components/common/Spinner'

/**
 * Register page — new user account creation.
 */
export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
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
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (!form.password || form.password.length < 8) errs.password = 'Password must be at least 8 characters.'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const data = await authService.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      login(data.user, data.access_token)
      toast.success(`Welcome, ${data.user.name}! Account created successfully.`)
      navigate('/dashboard')
    } catch (err) {
      const apiErrors = err.response?.data?.errors || {}
      const msg = err.response?.data?.message || 'Registration failed.'
      if (Object.keys(apiErrors).length > 0) setErrors(apiErrors)
      else toast.error(msg)
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
    <div className="min-h-screen flex bg-slate-950 items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <RiCheckboxCircleLine className="text-white text-xl" />
          </div>
          <p className="text-white font-bold text-xl">TaskFlow</p>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="text-slate-400 mt-2">Join thousands of productive users today.</p>
        </div>

        <form onSubmit={handleSubmit} id="register-form" className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="reg-name" className="block text-sm font-medium text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={inputClass('name')}
              autoFocus
            />
            {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-slate-300 mb-1.5">
              Email address
            </label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password" className="block text-sm font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
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

          {/* Confirm password */}
          <div>
            <label htmlFor="reg-confirm" className="block text-sm font-medium text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <input
              id="reg-confirm"
              name="confirm"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repeat your password"
              className={inputClass('confirm')}
            />
            {errors.confirm && <p className="text-rose-400 text-xs mt-1">{errors.confirm}</p>}
          </div>

          {/* Submit */}
          <button
            id="register-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Spinner size="sm" /> : null}
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
