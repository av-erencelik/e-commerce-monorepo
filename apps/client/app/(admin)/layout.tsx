import MainNav from '@client/components/main-nav';
import { adminNavigation } from '@client/config/admin-navigation';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col gap-10">
      <div className="border-b">
        <header className="z-40 bg-background sm:container px-4">
          <nav className="py-4 flex gap-2 items-center">
            <MainNav navItems={adminNavigation} isAdmin={true} />
          </nav>
        </header>
      </div>
      <main className="flex-1 bg-background sm:container">{children}</main>
    </div>
  );
};

export default AdminLayout;
