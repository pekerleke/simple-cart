"user server"

import { supabaseServerClient } from '@/utils/supabaseServer';

const createOrEditProduct = async (body: any)  => {
    const supabase = await supabaseServerClient();

    const {} = await supabase.rpc("add_product", {});
};

export default createOrEditProduct;