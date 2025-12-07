import { create} from 'zustand'
interface AuthState {
    readonly isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set)=>({
    isAuthenticated: true, // default state
    login: () => set({isAuthenticated: true}),
    logout: () => set({isAuthenticated: false}),
}))

export default useAuthStore;