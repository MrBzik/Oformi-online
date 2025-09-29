import {caller, getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {IncomeChart} from "@/modules/referral/ui/views/income-chart";
import {ReferralHeader} from "@/modules/referral/ui/components/referral-header";

export const dynamic = "force-dynamic";

const Page = async () => {

    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.orders.getForReferral.queryOptions())
    const {user} = await caller.auth.session()
    const percentage = await caller.referral.getReferralPercentage()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="px-4 lg:px-12 py-8 flex flex-col gap-6">
                <ReferralHeader refPercentage={percentage} userId={user?.id}/>
                <IncomeChart/>
            </div>
        </HydrationBoundary>
    );
}

export default Page