import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { createClient } from "@/lib/supabase/server";
import { getMemoriesByOwner } from "@/lib/supabase/database";
import { 
  Plus, 
  Heart, 
  Eye, 
  Calendar, 
  Sparkles,
  Image as ImageIcon,
  Music,
  Share2,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const STATUS_CONFIG = {
  DRAFT: {
    label: "Rascunho",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  PAID: {
    label: "Publicado",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  ARCHIVED: {
    label: "Arquivado",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    icon: AlertCircle,
  },
} as const;

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Buscar memórias do usuário
  const memories = user ? await getMemoriesByOwner(user.id) : [];
  
  // Estatísticas
  const stats = {
    total: memories.length,
    published: memories.filter(m => m.status === "PAID").length,
    drafts: memories.filter(m => m.status === "DRAFT").length,
    totalViews: memories.reduce((acc, m) => acc + (m.content.metrics?.views || 0), 0),
  };

  const firstName = user?.user_metadata?.name?.split(" ")[0] || "você";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <DashboardHeader user={{ email: user?.email, name: user?.user_metadata?.name }} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Olá, {firstName}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas memórias digitais e crie momentos eternos.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-0 shadow-lg shadow-violet-500/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-100 text-sm font-medium">Total</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Heart className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg shadow-emerald-500/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Publicadas</p>
                  <p className="text-3xl font-bold">{stats.published}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-lg shadow-amber-500/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Rascunhos</p>
                  <p className="text-3xl font-bold">{stats.drafts}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-0 shadow-lg shadow-pink-500/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">Visualizações</p>
                  <p className="text-3xl font-bold">{stats.totalViews}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Eye className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Minhas Memórias
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {memories.length === 0 
                ? "Você ainda não criou nenhuma memória" 
                : `${memories.length} memória${memories.length > 1 ? 's' : ''} criada${memories.length > 1 ? 's' : ''}`
              }
            </p>
          </div>
          <Link href="/editor">
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25">
              <Plus className="w-4 h-4 mr-2" />
              Nova Memória
            </Button>
          </Link>
        </div>

        {/* Memories Grid */}
        {memories.length === 0 ? (
          /* Empty State */
          <Card className="border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <CardContent className="flex flex-col items-center justify-center py-16 px-4">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full blur-2xl opacity-20 animate-pulse" />
                <div className="relative bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/30 dark:to-pink-900/30 p-6 rounded-full">
                  <Sparkles className="w-12 h-12 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Crie sua primeira memória
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                Transforme seus momentos especiais em páginas digitais emocionantes. 
                Adicione fotos, músicas e mensagens de voz.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                  <ImageIcon className="w-4 h-4 text-violet-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Fotos</span>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                  <Music className="w-4 h-4 text-pink-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Música</span>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                  <Share2 className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Compartilhar</span>
                </div>
              </div>
              
              <Link href="/editor">
                <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25">
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Primeira Memória
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Memories List */
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Create New Card */}
            <Link href="/editor" className="group">
              <Card className="h-full border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 bg-gray-50/50 dark:bg-gray-900/50">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] py-8">
                  <div className="bg-violet-100 dark:bg-violet-900/30 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <p className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    Nova Memória
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            {/* Memory Cards */}
            {memories.map((memory) => {
              const StatusIcon = STATUS_CONFIG[memory.status].icon;
              const statusConfig = STATUS_CONFIG[memory.status];
              const firstImage = memory.content.media?.[0]?.url;
              
              return (
                <Link key={memory.id} href={`/editor?id=${memory.id}`} className="group">
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-900">
                    {/* Image Preview */}
                    <div className="relative h-32 bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/20 dark:to-pink-900/20">
                      {firstImage ? (
                        <img 
                          src={firstImage} 
                          alt={memory.content.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Heart className="w-8 h-8 text-violet-300 dark:text-violet-700" />
                        </div>
                      )}
                      {/* Color Indicator */}
                      <div 
                        className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: memory.content.primaryColor }}
                      />
                    </div>
                    
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg line-clamp-1 group-hover:text-violet-600 transition-colors">
                          {memory.content.title || "Sem título"}
                        </CardTitle>
                        <Badge variant="outline" className={`${statusConfig.color} shrink-0`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {memory.content.description || "Sem descrição"}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <ImageIcon className="w-4 h-4" />
                            {memory.content.media?.length || 0}
                          </span>
                          {memory.content.musicUrl && (
                            <span className="flex items-center gap-1">
                              <Music className="w-4 h-4 text-pink-500" />
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {memory.content.metrics?.views || 0}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3" />
                          {new Date(memory.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
