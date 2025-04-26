import { test, expect, describe } from 'vitest'
import { getEditRequirements } from './getEditRequirements'

describe('getEditRequirements', () => {
  test('should return all requirements with first not met for "not logged in" error', () => {
    const requirements = getEditRequirements("You're not logged in")
    
    expect(requirements.length).toBe(3)
    expect(requirements[0].displayName).toBe("Signed in to Creatorsgarten")
    expect(requirements[0].met).toBe(false)
    expect(requirements[0].callToAction?.text).toBe("sign in")
    expect(requirements[0].callToAction?.url).toBe("/auth/login?dest=/dashboard/profile")
    
    // Subsequent requirements should be not met for cleaner UX
    expect(requirements[1].met).toBe(false)
    expect(requirements[2].met).toBe(false)
  })

  test('should return all requirements with second not met for "not authenticated" error', () => {
    const requirements = getEditRequirements("Not authenticated")
    
    expect(requirements.length).toBe(3)
    expect(requirements[0].displayName).toBe("Signed in to Creatorsgarten")
    expect(requirements[0].met).toBe(true)
    expect(requirements[1].displayName).toBe("GitHub Account connected")
    expect(requirements[1].met).toBe(false)
    expect(requirements[1].callToAction?.text).toBe("connect")
    expect(requirements[1].callToAction?.url).toBe("/dashboard/profile#github")
    
    // Subsequent requirement should be not met for cleaner UX
    expect(requirements[2].met).toBe(false)
  })

  test('should return all requirements with third not met for "creators team" error', () => {
    const requirements = getEditRequirements('You should be in the "creators" team to edit the wiki')
    
    expect(requirements.length).toBe(3)
    expect(requirements[0].displayName).toBe("Signed in to Creatorsgarten")
    expect(requirements[0].met).toBe(true)
    expect(requirements[1].displayName).toBe("GitHub Account connected")
    expect(requirements[1].met).toBe(true)
    expect(requirements[2].displayName).toBe("Joined the \"creators\" team in GitHub")
    expect(requirements[2].met).toBe(false)
    expect(requirements[2].callToAction?.text).toBe("join")
    expect(requirements[2].callToAction?.url).toBe("/wiki/JoinCreatorsTeam")
  })

  test('should return all requirements as met for unknown error', () => {
    const requirements = getEditRequirements('Some other error message')
    
    expect(requirements.length).toBe(3)
    expect(requirements[0].displayName).toBe("Signed in to Creatorsgarten")
    expect(requirements[0].met).toBe(true)
    expect(requirements[1].displayName).toBe("GitHub Account connected")
    expect(requirements[1].met).toBe(true)
    expect(requirements[2].displayName).toBe("Joined the \"creators\" team in GitHub")
    expect(requirements[2].met).toBe(true)
  })
})