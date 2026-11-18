import { Box } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
 
export default function NotFound() {
  return (
      <div
        className="py-10 flex items-center flex-col justify-center h-full"
      >
        <h3 className="mb-2 text-3xl font-black">
          Sorry, page not found!
        </h3>

        <p className="text-gray-500 text-center pt-2 text-lg">
          Sorry, we couldn't find the page you're looking for. Perhaps<br/> you've mistyped the URL? Be sure to check your spelling.
        </p>

        <Image
          src="/illustration-404.svg"
          className="w-[320px] h-auto my-5 sm:my-10"
          width={320}
          height={320}
          alt="404"
        />

        <Link href="/" className="bg-[#1c252e] text-white font-semibold px-4 py-3 mt-10 rounded-md">
          Go to home
        </Link>
      </div>
  )
}