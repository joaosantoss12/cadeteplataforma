export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Tabela de Perfis de Utilizador
      profiles: {
        Row: {
          id: string
          nome: string | null
          email: string
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nome?: string | null
          email: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string | null
          email?: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      
      // Tabela de Configurações do Sistema
      configuracoes: {
        Row: {
          id: number
          chave: string
          valor: string
          descricao: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          chave: string
          valor: string
          descricao?: string | null
          updated_at?: string
        }
        Update: {
          id?: number
          chave?: string
          valor?: string
          descricao?: string | null
          updated_at?: string
        }
      }
      
      // Tabela de Apostas (Gestão de Banca)
      apostas: {
        Row: {
          id: number
          user_id: string
          data: string
          jogo: string
          mercado: string
          valor: number
          odd: number
          retorno: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          data: string
          jogo: string
          mercado: string
          valor: number
          odd: number
          retorno: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          data?: string
          jogo?: string
          mercado?: string
          valor?: number
          odd?: number
          retorno?: number
          created_at?: string
        }
      }
      
      // Tabela de Estádios
      estadios: {
        Row: {
          id: number
          nome: string
          localizacao: string
          capacidade: string
          inauguracao: string
          facto: string
          instagram_link: string
          instagram_post_url: string | null
          data_visita: string | null
          imagem_bg: string
          icon_color: string
          created_at: string
        }
        Insert: {
          id?: number
          nome: string
          localizacao: string
          capacidade: string
          inauguracao: string
          facto: string
          instagram_link: string
          instagram_post_url?: string | null
          data_visita?: string | null
          imagem_bg?: string
          icon_color?: string
          created_at?: string
        }
        Update: {
          id?: number
          nome?: string
          localizacao?: string
          capacidade?: string
          inauguracao?: string
          facto?: string
          instagram_link?: string
          instagram_post_url?: string | null
          data_visita?: string | null
          imagem_bg?: string
          icon_color?: string
          created_at?: string
        }
      }
      
      // Tabela de Análise do Dia
      analise_dia: {
        Row: {
          id: number
          data: string
          liga: string
          jogo: string
          hora: string
          aposta: string
          odd: number
          analise_contexto: string
          analise_estatisticas_casa: string
          analise_estatisticas_fora: string
          analise_conclusao: string
          resultado: 'pendente' | 'green' | 'red' | null
          created_at: string
        }
        Insert: {
          id?: number
          data: string
          liga: string
          jogo: string
          hora: string
          aposta: string
          odd: number
          analise_contexto: string
          analise_estatisticas_casa: string
          analise_estatisticas_fora: string
          analise_conclusao: string
          resultado?: 'pendente' | 'green' | 'red' | null
          created_at?: string
        }
        Update: {
          id?: number
          data?: string
          liga?: string
          jogo?: string
          hora?: string
          aposta?: string
          odd?: number
          analise_contexto?: string
          analise_estatisticas_casa?: string
          analise_estatisticas_fora?: string
          analise_conclusao?: string
          resultado?: 'pendente' | 'green' | 'red' | null
          created_at?: string
        }
      }
      
      // Tabela de Análise Premium
      analise_premium: {
        Row: {
          id: number
          data: string
          liga: string
          jogo: string
          hora: string
          aposta: string
          odd: number
          analise_contexto: string
          analise_estatisticas_casa: string
          analise_estatisticas_fora: string
          analise_conclusao: string
          resultado: 'pendente' | 'green' | 'red' | null
          preco: number
          created_at: string
        }
        Insert: {
          id?: number
          data: string
          liga: string
          jogo: string
          hora: string
          aposta: string
          odd: number
          analise_contexto: string
          analise_estatisticas_casa: string
          analise_estatisticas_fora: string
          analise_conclusao: string
          resultado?: 'pendente' | 'green' | 'red' | null
          preco?: number
          created_at?: string
        }
        Update: {
          id?: number
          data?: string
          liga?: string
          jogo?: string
          hora?: string
          aposta?: string
          odd?: number
          analise_contexto?: string
          analise_estatisticas_casa?: string
          analise_estatisticas_fora?: string
          analise_conclusao?: string
          resultado?: 'pendente' | 'green' | 'red' | null
          preco?: number
          created_at?: string
        }
      }
      
      // Tabela de Compras de Análises Premium
      compras_premium: {
        Row: {
          id: number
          user_id: string
          analise_premium_id: number
          data_compra: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          analise_premium_id: number
          data_compra?: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          analise_premium_id?: number
          data_compra?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Types helpers para usar nas páginas
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Aposta = Database['public']['Tables']['apostas']['Row'];
export type ApostaInsert = Database['public']['Tables']['apostas']['Insert'];
export type Estadio = Database['public']['Tables']['estadios']['Row'];
export type EstadioInsert = Database['public']['Tables']['estadios']['Insert'];
export type AnaliseDia = Database['public']['Tables']['analise_dia']['Row'];
export type AnaliseDiaInsert = Database['public']['Tables']['analise_dia']['Insert'];
export type AnalisePremium = Database['public']['Tables']['analise_premium']['Row'];
export type AnalisePremiumInsert = Database['public']['Tables']['analise_premium']['Insert'];
export type CompraPremium = Database['public']['Tables']['compras_premium']['Row'];
export type Configuracao = Database['public']['Tables']['configuracoes']['Row'];
