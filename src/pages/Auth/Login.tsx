import Background from "../../assets/images/background.png"
import { LoginForm } from "../../components/Form/LoginForm"
import Logo from "../../assets/images/auxplutes.png"

export default function Login() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <img src={Logo} alt="Taqanal Energy Logo" className="h-10 w-25" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block bg-black">
        <img
          src={Background}
          alt="Taqanal Energy Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-2xl font-bold">
            TAQANAL
            <div className="text-sm font-normal opacity-75">energy</div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
