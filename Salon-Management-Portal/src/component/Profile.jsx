import { useEffect, useState } from 'react';
import '../css/Profile.css';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
  getMeService,
  updateProfileService,
  changePasswordService,
} from '../services/authService';
import { updateUser } from '../store/authSlice';
import { LoadingSpinner, PageHeader, inputClass, btnPrimary } from './common/ui';

function Profile() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      bio: '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMeService();
        const user = res.user || res.data || res;
        resetProfile({
          name: user.name || '',
          phone: user.phone || '',
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zip: user.address?.zip || '',
          bio: user.bio || '',
        });
      } catch (err) {
        setProfileError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [resetProfile]);

  const onSaveProfile = async (data) => {
    setProfileMsg('');
    setProfileError('');
    setSavingProfile(true);
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        bio: data.bio,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zip: data.zip,
        },
      };
      const res = await updateProfileService(payload);
      const user = res.user || res.data || data;
      dispatch(updateUser(user));
      setProfileMsg('Profile updated successfully');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async (data) => {
    setPasswordMsg('');
    setPasswordError('');
    setSavingPassword(true);
    try {
      await changePasswordService({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPasswordMsg('Password changed successfully');
      resetPassword();
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="profile-page-wrap">
      <PageHeader title="My Profile" subtitle="Update your account details" />

      <form onSubmit={handleProfileSubmit(onSaveProfile)} className="profile-form-card">
        <h2 className="profile-form-title">Profile Information</h2>

        <div className="profile-field">
          <label className="profile-label">Name</label>
          <input
            className={inputClass()}
            {...registerProfile('name', { required: 'Name is required' })}
          />
          {profileErrors.name && (
            <p className="profile-field-error">{profileErrors.name.message}</p>
          )}
        </div>

        <div className="profile-field">
          <label className="profile-label">Phone</label>
          <input className={inputClass()} {...registerProfile('phone')} />
        </div>

        <div className="profile-address-grid">
          <div className="profile-field">
            <label className="profile-label">Street</label>
            <input className={inputClass()} {...registerProfile('street')} />
          </div>
          <div className="profile-field">
            <label className="profile-label">City</label>
            <input className={inputClass()} {...registerProfile('city')} />
          </div>
          <div className="profile-field">
            <label className="profile-label">State</label>
            <input className={inputClass()} {...registerProfile('state')} />
          </div>
          <div className="profile-field">
            <label className="profile-label">ZIP</label>
            <input className={inputClass()} {...registerProfile('zip')} />
          </div>
        </div>

        <div className="profile-field">
          <label className="profile-label">Bio</label>
          <textarea
            rows={3}
            className={inputClass()}
            {...registerProfile('bio')}
          />
        </div>

        {profileError && <p className="profile-msg-error">{profileError}</p>}
        {profileMsg && <p className="profile-msg-success">{profileMsg}</p>}

        <button type="submit" disabled={savingProfile} className={btnPrimary()}>
          {savingProfile ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit(onChangePassword)} className="profile-form-card">
        <h2 className="profile-form-title">Change Password</h2>

        <div className="profile-field">
          <label className="profile-label">Current Password</label>
          <input
            type="password"
            className={inputClass()}
            {...registerPassword('currentPassword', { required: 'Current password is required' })}
          />
          {passwordErrors.currentPassword && (
            <p className="profile-field-error">{passwordErrors.currentPassword.message}</p>
          )}
        </div>

        <div className="profile-field">
          <label className="profile-label">New Password</label>
          <input
            type="password"
            className={inputClass()}
            {...registerPassword('newPassword', {
              required: 'New password is required',
              minLength: { value: 6, message: 'At least 6 characters' },
            })}
          />
          {passwordErrors.newPassword && (
            <p className="profile-field-error">{passwordErrors.newPassword.message}</p>
          )}
        </div>

        <div className="profile-field">
          <label className="profile-label">Confirm Password</label>
          <input
            type="password"
            className={inputClass()}
            {...registerPassword('confirmPassword', {
              required: 'Please confirm password',
              validate: (v) => v === newPassword || 'Passwords do not match',
            })}
          />
          {passwordErrors.confirmPassword && (
            <p className="profile-field-error">{passwordErrors.confirmPassword.message}</p>
          )}
        </div>

        {passwordError && <p className="profile-msg-error">{passwordError}</p>}
        {passwordMsg && <p className="profile-msg-success">{passwordMsg}</p>}

        <button type="submit" disabled={savingPassword} className={btnPrimary()}>
          {savingPassword ? 'Updating...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

export default Profile;
