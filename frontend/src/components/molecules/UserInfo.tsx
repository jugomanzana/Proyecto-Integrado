import React from 'react';
import { Avatar } from '../atoms/Avatar';

// ============================================================
// MOLÉCULA: UserInfo
// Combina Avatar + nombre de usuario + rol/subtítulo.
// Usada en la Navbar y en menús desplegables de perfil.
// ============================================================

type UserInfoLayout = 'horizontal' | 'vertical';

interface UserInfoProps {
  username:   string;
  email?:     string;
  avatarSrc?: string | null;
  role?:      string;
  layout?:    UserInfoLayout;
  className?: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({
  username,
  email,
  avatarSrc   = null,
  role,
  layout      = 'horizontal',
  className   = '',
}) => {
  const isVertical = layout === 'vertical';

  return (
    <div
      className={[
        'flex gap-3',
        isVertical ? 'flex-col items-center text-center' : 'flex-row items-center',
        className,
      ].join(' ')}
    >
      <Avatar
        src={avatarSrc}
        alt={username}
        size={isVertical ? 'lg' : 'md'}
      />

      <div className={isVertical ? '' : 'min-w-0'}>
        <p className={[
          'font-semibold text-warm-dark leading-tight',
          isVertical ? 'text-base' : 'text-sm truncate',
        ].join(' ')}>
          {username}
        </p>

        {(email || role) && (
          <p className={[
            'text-warm-muted leading-tight mt-0.5',
            isVertical ? 'text-sm' : 'text-xs truncate',
          ].join(' ')}>
            {role ?? email}
          </p>
        )}
      </div>
    </div>
  );
};
