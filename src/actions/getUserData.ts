// import { User } from '@/types/app';
import { supabaseServerClient } from '@/utils/supabaseServer';


// TODO: borrar
const getUserData = async (): Promise<any | null> => {
    const supabase = await supabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data, error } = await supabase
        .from('users_duplicate')
        .select('*')
        .eq('id', user.id);

    if (error) {
        console.error(error);
        return null;
    }

    return data ? data[0] : null;
};

export default getUserData;