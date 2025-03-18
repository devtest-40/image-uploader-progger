
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleMultiSelectMode, clearSelection } from '@/store/imagesSlice';
import { CheckSquare, Square, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSelectionToggle?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Image Uploader", 
  showBack = false,
  showSelectionToggle = false,
  className 
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { multiSelectMode } = useAppSelector(state => state.images);

  const handleToggleSelectMode = () => {
    dispatch(toggleMultiSelectMode());
  };

  const handleBack = () => {
    if (location.pathname === '/edit') {
      dispatch(clearSelection());
    }
    navigate(-1);
  };

  return (
    <header className={cn("w-full py-4 px-4 flex items-center justify-between bg-white shadow-sm", className)}>
      <div className="flex items-center">
        {showBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
        )}
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>
      
      {showSelectionToggle && (
        <Button
          variant="ghost"
          onClick={handleToggleSelectMode}
          className="flex items-center text-app-blue"
        >
          {multiSelectMode ? (
            <>
              <CheckSquare size={18} className="mr-2" />
              Multiple
            </>
          ) : (
            <>
              <Square size={18} className="mr-2" />
              Single
            </>
          )}
        </Button>
      )}
    </header>
  );
};

export default Header;
