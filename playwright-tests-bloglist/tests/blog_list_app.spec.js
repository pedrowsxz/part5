import { request } from 'http'
import { before } from 'node:test'

const { test, expect, beforeEach, describe } = require ('@playwright/test')

describe('Blog app', () => {
  beforeEach( async ({ page, request }) => {
    await request.post('http://localhost:5173/api/testing/reset')
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'Test User',
        username: 'tester',
        password: 'testpassword'
      }
    })
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'Second Test User',
        username: 'secondtester',
        password: 'secondtestpassword'
      }
    })


    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('tester')
      await page.getByTestId('password').fill('testpassword')
      await page.getByRole('button', { name: 'login' }).click()

      const  successDiv = await page.locator('.success')
      await expect(successDiv).toContainText('logged in')
      await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
      await expect(page.getByText('Wrong name or password')).not.toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('tester')
      await page.getByTestId('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()
      
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong name or password')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('logged in')).not.toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await page.getByTestId('username').fill('tester')
        await page.getByTestId('password').fill('testpassword')
        await page.getByRole('button', { name: 'login' }).click()
      })
    
      test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.locator('#title-input').fill('test blog')
        await page.locator('#author-input').fill('test author')
        await page.locator('#url-input').fill('test url')
        await page.getByRole('button', { name: 'create' }).click()

        const successDiv = await page.locator('.success')
        await expect(successDiv).toContainText('a new blog test blog by Test User added')
        await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
        await expect(page.getByText('test blog test author')).toBeVisible()
      })

      describe('When logged in user created new blog', () => {
        beforeEach(async ({ page }) => {
          await page.getByRole('button', { name: 'new blog' }).click()
          await page.locator('#title-input').fill('test blog')
          await page.locator('#author-input').fill('test author')
          await page.locator('#url-input').fill('test url')
          await page.getByRole('button', { name: 'create' }).click()
        })

        test('the new created blog can be liked', async () => {
          await page.getByRole('button', { name: 'view' }).click()
          await page.getByRole('button', { name: 'like' }).click()
          await expect(page.getByText('1')).toBeVisible()
        })

        test('user who added the blog can delete the blog', async () => {
          await page.getByRole('button', { name: 'view' }).click()
          page.on('dialog', dialog => dialog.accept())
          await page.getByRole('button', { name: 'remove' }).click()

          const successDiv = await page.locator('.success')
          await expect(successDiv).toContainText('blog test blog by Test User removed')
          await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
          await expect(page.getByText('test blog test author')).not.toBeVisible()
        })

        test('only the user who added the blog sees the blog delete button', async () => {
          await page.getByRole('button', { name: 'logout' }).click()

          await page.getByTestId('username').fill('secondtester')
          await page.getByTestId('password').fill('secondtestpassword')

          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })

        test('blogs are arranged in the descending order according to the likes', async () => {
          //...
        })
      })
    })
  })    
})