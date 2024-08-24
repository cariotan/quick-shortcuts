namespace BlazorApp1.Shared
{
	public interface IModel
	{
		void Validate<T>(ModelState<T> modelState) where T : IModel;
	}
}
