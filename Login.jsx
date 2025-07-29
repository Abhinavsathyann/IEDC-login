import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

const handleLogin = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    alert('Login failed: ' + error.message)
    return
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('email', email)
    .single()

  if (profile.role === 'admin') {
    navigate('/admin-dashboard')
  } else {
    navigate('/user-dashboard')
  }
}
