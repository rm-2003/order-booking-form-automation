import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ChartLine, CircleNotch, LineSegment, Wrench } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { PieStatusChart } from "../components/chart/chart";
import { obfService, OBF as ApiOBF } from "../services/api";
import { Clock } from "@phosphor-icons/react/dist/ssr";

// Use the OBF type from api.ts, but override date fields to string for this page
interface OBF extends Omit<ApiOBF, 'created_at' | 'updated_at'> {
  created_at: string;
  updated_at: string;
}

// Helper to get color classes for project_status
const statusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-[#d5233b]/20 text-[#d5233b]';
    case 'rejected': return 'bg-[#ff5630]/20 text-[#ff5630]';
    case 'submitted': return 'bg-[#006c9c]/20 text-[#006c9c]';
    case 'draft': return 'bg-[#ffd666]/40 text-[#bfa100]';
    case 'archived': return 'bg-gray-200 text-gray-500';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [allOBFs, setAllOBFs] = useState<OBF[]>([]); // Store all OBFs
  const [activeOBFs, setActiveOBFs] = useState<OBF[]>([]);
  const [recentOBFs, setRecentOBFs] = useState<OBF[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate status distribution for pie chart (use all OBFs)
  const getStatusDistribution = () => {
    const statusCounts = allOBFs.reduce((acc, obf) => {
      acc[obf.project_status] = (acc[obf.project_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    const config = {
      approved: { label: "Approved", color: "#d5233b" },
      submitted: { label: "Submitted", color: "#006c9c" },
      rejected: { label: "Rejected", color: "#ff5630" },
      draft: { label: "Draft", color: "#ffd666" },
      archived: { label: "Archived", color: "#888888" },
    };
  
    return { statusCounts, config };
  };

  useEffect(() => {
    const fetchOBFs = async () => {
      try {
        const { data } = await obfService.getAll();
        // Convert created_at and updated_at to string for compatibility
        const obfs: OBF[] = data.map((obf: ApiOBF) => ({
          ...obf,
          created_at: obf.created_at instanceof Date ? obf.created_at.toISOString() : obf.created_at,
          updated_at: obf.updated_at instanceof Date ? obf.updated_at.toISOString() : obf.updated_at,
        }));
        setAllOBFs(obfs); // Store all OBFs
        // Filter OBFs that are not approved for active projects
        const activeOBFs = obfs.filter((obf: OBF) => obf.project_status !== 'archived');
        setActiveOBFs(activeOBFs);

        // Sort all OBFs by updated_at timestamp for recent OBFs
        const sortedOBFs = [...obfs].sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setRecentOBFs(sortedOBFs.slice(0, 10));
      } catch (error) {
        console.error('Error fetching OBFs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchOBFs();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <img src="/Loading/newpreeload.gif" alt="Loading..." className="w-[150px] h-[150px]" />
        <div className="mt-4 text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Hi {user?.name ? user.name.split(" ")[0].charAt(0).toUpperCase() + user.name.split(" ")[0].slice(1).toLowerCase() : ''}, Welcome back! 👋</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartLine size={22} weight="duotone" className="text-primary" />
              Project Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="items-center h-max justify-center flex">
            {allOBFs.length > 0 ? (
              <div className="h-full w-full">
                {(() => {
                  const { statusCounts, config } = getStatusDistribution();
                  const data = Object.entries(statusCounts).map(([status, value]) => ({ status, value }));
                  return (
                    <PieStatusChart
                      data={data}
                      config={config}
                      className="h-full w-full"
                    />
                  );
                })()}
              </div>
            ) : (
              <div className="text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
        <Card className="h-80 overflow-y-scroll relative">
          <CardHeader className="sticky top-0 bg-white z-10">
            <CardTitle className="flex items-center gap-2">
              {/* <CircleNotch size={22} weight="bold" className="text-primary" /> */}
              <Wrench size={22} weight="duotone" className="text-primary" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeOBFs.length > 0 ? (
              <div className="sm:space-y-1 space-y-4">
                {activeOBFs.map((obf) => (
                  <div 
                    key={obf.id}
                    className="flex items-center justify-between sm:p-2 hover:bg-accent rounded-lg cursor-pointer"
                    onClick={() => navigate(`/obf/${obf.id}`)}
                  >
                    <div>
                      <div className="font-medium">{obf.project_name} <span className="text-xs text-gray-400">({obf.project_code})</span></div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        Client: {obf.client_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                      Created: {new Date(obf.created_at).toLocaleDateString()}
                    </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(obf.project_status)}`}>{obf.project_status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">No active projects</div>
            )}
          </CardContent>
        </Card>
        
        <Card className="h-80 overflow-y-scroll relative">
          <CardHeader className="sticky top-0 bg-white z-10">
            <CardTitle className="flex items-center gap-2">
              <Clock size={22} weight="duotone" className="text-primary" />
              Recent OBFs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOBFs.length > 0 ? (
              <div className="sm:space-y-1 space-y-4">
                {recentOBFs.map((obf) => (
                  <div 
                    key={obf.id}
                    className="flex items-center justify-between sm:p-2 hover:bg-accent rounded-lg cursor-pointer"
                    onClick={() => navigate(`/obf/${obf.id}`)}
                  >
                    <div>
                      <div className="font-medium">{obf.project_name} <span className="text-xs text-gray-400">({obf.project_code})</span></div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        Client: {obf.client_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                      Updated: {new Date(obf.updated_at).toLocaleDateString()}
                    </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(obf.project_status)}`}>{obf.project_status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">No recent OBFs</div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}