using BlazorApp1.Shared;
using Microsoft.AspNetCore.Identity;

namespace BlazorApp1.Server
{
	public class LoginService
	{
		private UserManager<IdentityUser> userManager;
		private SignInManager<IdentityUser> signInManager;

		public LoginService(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
		{
			this.userManager = userManager;
			this.signInManager = signInManager;
		}

		public async Task<(bool succeeded, bool failed, bool requireTwoFactor, bool isLockout)> Login(string username, string password, bool keepLogin = false, bool lockoutOnFailure = false)
		{
			(bool succeeded, bool failed, bool requireTwoFactor, bool isLockout) nani = (false, false, false, false);

			var result = await signInManager.PasswordSignInAsync(username, password, keepLogin, lockoutOnFailure);

			if(result.Succeeded)
			{
				nani.succeeded = true;
			}
			else if(result.RequiresTwoFactor)
			{
				nani.requireTwoFactor = true;
			}
			else if(result.IsLockedOut)
			{
				nani.isLockout = true;
			}
			else
			{
				nani.failed = true;
			}

			return nani;
		}

		public async Task<(bool succeeded, IEnumerable<string>? errors)> Register(string username, string password)
		{
			IdentityUser user = new(username);

			var result = await userManager.CreateAsync(user, password);

			if(result.Succeeded)
			{
				return (true, null);
			}
			else
			{
				return (false, result.Errors.Select(x => x.Description).ToArray());
			}
		}

		public async Task Signout()
		{
			await signInManager.SignOutAsync();
		}
	}
}
