import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function setupAdminUser() {
  try {
    console.log('Setting up admin user...')
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'tyshawnmorehed102@proton.me',
      password: 'Sheraljean1!',
      email_confirm: true,
      user_metadata: {
        is_admin: true,
        name: 'Tyshawn Morehead',
      },
    })

    if (error) {
      console.error('Error creating user:', error.message)
      
      // If user already exists, try to update password instead
      if (error.message.includes('already exists')) {
        console.log('User already exists, attempting to reset password...')
        
        const { error: resetError } = await supabase.auth.admin.updateUserById(
          data?.user?.id || '',
          { password: 'Sheraljean1!' }
        )
        
        if (resetError) {
          console.error('Error resetting password:', resetError.message)
          process.exit(1)
        }
        
        console.log('✓ Password updated successfully')
      } else {
        process.exit(1)
      }
    } else {
      console.log('✓ Admin user created successfully')
      console.log(`Email: ${data.user?.email}`)
      console.log(`UID: ${data.user?.id}`)
    }

    console.log('\n✓ Setup complete! You can now sign in at /auth/login')
    console.log('Email: tyshawnmorehed102@proton.me')
    console.log('Password: Sheraljean1!')
    
  } catch (err) {
    console.error('Unexpected error:', err)
    process.exit(1)
  }
}

setupAdminUser()
