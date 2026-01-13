import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-header border-b-2 border-primary shadow-2xl">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-blue-400 rounded-2xl flex items-center justify-center shadow-2xl glow-blue">
              <Shield className="w-7 h-7 lg:w-9 lg:h-9 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-4xl font-black text-foreground tracking-tight">
                BlueWhale Intelligence
              </h1>
              <p className="text-primary/80 text-xs lg:text-sm font-medium">
                Cape Town Safety & Security Command Center
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="flex items-center space-x-2 bg-safety-good px-4 lg:px-5 py-2 rounded-lg shadow-lg pulse-live">
              <div className="w-2 h-2 bg-foreground rounded-full" />
              <span className="text-xs lg:text-sm font-bold text-foreground">LIVE MONITORING</span>
            </div>
            <div className="hidden sm:block text-right text-xs lg:text-sm">
              <div className="text-muted-foreground">Last Updated</div>
              <div className="font-mono text-foreground">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
