using Microsoft.AspNetCore.Components.Authorization;
using System.Security.Claims;

namespace BlazorApp1.Client
{
	public class AuthStateProvider : AuthenticationStateProvider
	{
		private HttpClient httpClient;

		public AuthStateProvider(HttpClient httpClient)
		{
			this.httpClient = httpClient;
		}

		public override async Task<AuthenticationState> GetAuthenticationStateAsync()
		{
			var response = await httpClient.GetAsync("api/login/user");

			var nani = await response.Content.ReadAsStringAsync();

			if(!string.IsNullOrEmpty(nani))
			{
				Claim claim = new(ClaimTypes.Name, nani);
				ClaimsIdentity claimsIdentity = new("cookie");
				claimsIdentity.AddClaim(claim);
				ClaimsPrincipal claimsPrincipal = new(claimsIdentity);

				return new AuthenticationState(claimsPrincipal);
			}
			else
			{
				return new AuthenticationState(new ClaimsPrincipal());
			}
		}

		public void NotifyChanged()
		{
			NotifyAuthenticationStateChanged(GetAuthenticationStateAsync());
		}
	}
}
