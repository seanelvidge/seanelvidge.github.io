import numpy as np
import matplotlib.pyplot as plt

class Ball():
    def __init__(self, height=10, mass=2, radius=0.25, timestep=0.01, 
                 cor=0.8, gravity=9.81, rho=1.1, dyVis=1.7e-5,
                 dragCoef=0.3):
        """
        Initial set up of the ball
        """
        self.h = float(height) # Height
        self.m = float(mass) # Mass
        self.r = float(radius) # Ball radius
        self.D = float(radius)*2 # Diameter
        self.dt = float(timestep) # Internal model timestep
        self.e = float(cor) # Coefficient of restitution between ball and ground
        self.g = float(gravity) # Gravitional accerelation
        self.p = float(rho) # Air density
        self.u = float(dyVis) # Dynamic viscosity
        self.cd = float(dragCoef) # Drag coefficient
        self.A = np.pi*float(radius)**2 # Cross sectional area
        # Initial conditions
        self.v = 0. # Ball velocity
        self.a = 0. # Ball acceleration
        self.htSeries = np.array([float(height)])
        self.timeSeries = np.array([0.])
        
    def calcGravForce(self, m, g):
        return m*g
    
    def calcDragForce(self, p, D, v, u, r, cd, A):
        # Reynolds number
        Re = (p*D*v)/u
        
        if Re < 1:
            # If low Reynolds number use Stokes' law
            fd = 6*np.pi*u*r*v
        else:
            # Use drag equation
            fd = 0.5*p*cd*A*v**2
        
        return fd    
    
    def calcBuoyForce(self, r, p, g):
        return (4/3.)*np.pi*r**3*p*g
        
    
def propForward(ball, time=1):
    """
    Time is model output time, which is different from the internal model step
    """    
    numSteps = int(time/ball.dt)
    for n in np.arange(numSteps):
        if np.sign(ball.v) == 0:
            sig = 1
        else:
            sig = np.sign(ball.v)
            
        forces = (ball.calcGravForce(ball.m,ball.g) + 
                  sig*-1*ball.calcDragForce(ball.p,ball.D,ball.v,ball.u,ball.r,
                                            ball.cd,ball.A) -
                  ball.calcBuoyForce(ball.r, ball.p, ball.g))##
        
        ball.a = forces/ball.m
        ball.v = ball.v + ball.a*ball.dt      
        ball.h -= ball.v*ball.dt
            
        if ball.h <= 0 and  ball.v>=0:
            # Then the ball is touching the ground so now look at the bounce
            ball.v = -1.*ball.v*ball.e
            
        ball.htSeries = np.append(ball.htSeries, ball.h)
        ball.timeSeries = np.append(ball.timeSeries, 
                                    ball.timeSeries[-1]+ball.dt)

    return ball


if __name__ == "__main__":
    ball = Ball()
    ball = propForward(ball, time=15)
    plt.plot(ball.timeSeries,ball.htSeries)
    plt.xlabel('Time [sec]')
    plt.ylabel('Height [m]')
    plt.show()
