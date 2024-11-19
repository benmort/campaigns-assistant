import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function AdminPage() {
  const content = useTranslations('content');

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">{ content('admin.admin') }</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            { content('admin.admin_explanation') }.
          </p>
        </div>
        <div className="flex flex-col gap-4 px-4 sm:px-16">
          <ul className="space-y-4">
            <li>
              <Link href="/admin/system" className="text-blue-500 underline hover:text-blue-700">
                { content('admin.system') }
              </Link>
            </li>
            <li>
              <Link href="/admin/store" className="text-blue-500 underline hover:text-blue-700">
                { content('admin.store') }
              </Link>
            </li>
            <li>
              <Link href="/" className="text-blue-500 underline hover:text-blue-700">
                { content('back') }
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
