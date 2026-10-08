export default function MyProfile(){
    return(
        <div className = "flex flex-col text-tx-white container-page gap-y-[1.75rem]"> 
            <h1 className = "flex font-extrabold text-2xl">My Profile</h1>

            <div className = "flex font-semibold text-[0.875rem] gap-[0.875rem]">
                <p class="relative inline-block">
                    Personal Information
                    <span class="absolute left-0 bottom-[-0.875rem] h-[2.5px] w-full rounded-t-[2px] bg-[#EC3013]"></span>
                </p>
                <p class="relative inline-block">
                    My Tickets
                    <span class="absolute left-0 bottom-[-0.875rem] h-[2.5px] w-full rounded-t-[2px] bg-[#EC3013]"></span>
                </p>
            </div>
        </div>
    )
    



}