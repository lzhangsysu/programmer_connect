import React, { Fragment, useState, useEffect} from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';

const initialState = {
    company: '',
    website: '',
    location: '',
    status: '',
    skills: '',
    githubusername: '',
    bio: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    instagram: ''
};

const ProfileForm = ({ 
    profile: {profile, loading}, 
    createProfile, 
    getCurrentProfile, 
    history 
}) => {
    const [formData, setFormData] = useState(initialState);

    const creatingProfile = useRouteMatch('/create-profile');

    const [displaySocialInputs, toggleSocialInputs] = useState(false);

    useEffect(() => {
        if (!profile) getCurrentProfile();
        if (!loading && profile) {
            const profileData = { ...initialState };
            for (const key in profile) {
                if (key in profileData) {
                    profileData[key] = profile[key];
                }
            }
            for (const key in profile.social) {
                if (key in profileData) {
                    profileData[key] = profile.social[key];
                }
            }
            if (Array.isArray(profileData.skills)) {
                profileData.skills = profileData.skills.join(', ');
            }
            setFormData(profileData);
        }
    }, [loading, getCurrentProfile, profile]);

    const {
        company,
        website,
        location,
        status,
        skills,
        githubusername,
        bio,
        twitter,
        facebook,
        linkedin,
        youtube,
        instagram
    } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        createProfile(formData, history, true);
    }

    return (
        <Fragment>
            <h1 className="large text-primary">
                { creatingProfile ? 'Create Your Profile' : 'Edit Your Profile' }
            </h1>
            <p className="lead">
                <i className="fas fa-user" /> { creatingProfile ? 'Fill in your profile information here' : 'Make changes to your profile information here'}
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={onSubmit}>
                <div className="form-group">
                    <select name="status" value={status} onChange={onChange}>
                        <option>* Select Professional Status</option>
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="Junior Software Developer">Junior Software Developer</option>
                        <option value="Senior Software Developer">Senior Software Developer</option>
                        <option value="Contractor">Contractor</option>
                        <option value="Manager">Manager</option>
                        <option value="Student or Learning">Student or Learning</option>
                        <option value="Instructor">Instructor or Teacher</option>
                        <option value="Intern">Intern</option>
                        <option value="Other">Other</option>
                    </select>
                    <small className="form-text">Choose where you are in your career</small>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Company" 
                        name="company" 
                        value={company} 
                        onChange={onChange}
                    />
                    <small className="form-text">Your own company or your employee</small>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Website" 
                        name="website" 
                        value={website} 
                        onChange={onChange}
                    />
                    <small className="form-text">Your own or a company website</small>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Location" 
                        name="location" 
                        value={location} 
                        onChange={onChange}
                    />
                    <small className="form-text">City & state suggested (eg. Boston, MA)</small>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="* Skills" 
                        name="skills" 
                        value={skills} 
                        onChange={onChange}
                    />
                    <small className="form-text">Please use comma separated values (eg. Python, Java, Rust)</small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Github Username"
                        name="githubusername"
                        value={githubusername} 
                        onChange={onChange}
                    />
                    <small className="form-text">Enter your github username to display your github repos</small>
                </div>
                <div className="form-group">
                    <textarea 
                        placeholder="A short bio of yourself" 
                        name="bio" 
                        value={bio} 
                        onChange={onChange} 
                    />
                    <small className="form-text">Tell us a little about yourself</small>
                </div>

                <div className="my-2">
                    <button 
                        onClick={() => toggleSocialInputs(!displaySocialInputs)} 
                        type="button" 
                        className="btn btn-light"
                    >
                        Add Social Network Links
                    </button>
                    <span>Optional</span>
                </div>

                {displaySocialInputs && (
                    <Fragment>
                        <div className="form-group social-input">
                            <i className="fab fa-twitter fa-2x" />
                            <input 
                                type="text" 
                                placeholder="Twitter URL" 
                                name="twitter" 
                                value={twitter} 
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group social-input">
                            <i className="fab fa-facebook fa-2x" />
                            <input 
                                type="text" 
                                placeholder="Facebook URL" 
                                name="facebook" 
                                value={facebook} 
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group social-input">
                            <i className="fab fa-youtube fa-2x" />
                            <input 
                                type="text" 
                                placeholder="YouTube URL" 
                                name="youtube" 
                                value={youtube} 
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group social-input">
                            <i className="fab fa-linkedin fa-2x" />
                            <input 
                                type="text" 
                                placeholder="Linkedin URL" 
                                name="linkedin" 
                                value={linkedin} 
                                onChange={onChange} 
                            />
                        </div>
                        <div className="form-group social-input">
                            <i className="fab fa-instagram fa-2x" />
                            <input 
                                type="text" 
                                placeholder="Instagram URL" 
                                name="instagram" 
                                value={instagram} 
                                onChange={onChange}
                            />
                        </div>
                    </Fragment>
                )}

                
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>    
        </Fragment>
    );
};

ProfileForm.propTypes = {
    createProfile: PropTypes.func.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(ProfileForm);
