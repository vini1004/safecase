const params = new URLSearchParams(window.location.search);
const role = params.get('role');
const roleLabel = document.querySelector('#role-label');
if (roleLabel) roleLabel.textContent = role === 'staff' ? 'For teachers and staff' : 'For students';
document.querySelectorAll('[data-path]').forEach((link) => {
  const nextUrl = new URL(link.dataset.path, window.location.href);
  if (role) nextUrl.searchParams.set('role', role);
  link.href = nextUrl.href;
});
