import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold text-rose-600">GLOW</span>
            <span className="text-xl font-light text-gray-700">shop</span>
            <p className="mt-3 text-sm text-gray-500">
              당신의 피부를 위한 최고의 화장품을 만나보세요.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">쇼핑</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/products" className="text-sm text-gray-500 hover:text-rose-600">전체 상품</Link></li>
              <li><Link href="/products/category/skincare" className="text-sm text-gray-500 hover:text-rose-600">스킨케어</Link></li>
              <li><Link href="/products/category/makeup" className="text-sm text-gray-500 hover:text-rose-600">메이크업</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">고객센터</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/mypage" className="text-sm text-gray-500 hover:text-rose-600">마이페이지</Link></li>
              <li><Link href="/cart" className="text-sm text-gray-500 hover:text-rose-600">장바구니</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">계정</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/auth/login" className="text-sm text-gray-500 hover:text-rose-600">로그인</Link></li>
              <li><Link href="/auth/signup" className="text-sm text-gray-500 hover:text-rose-600">회원가입</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-gray-400">© 2024 GLOWshop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
