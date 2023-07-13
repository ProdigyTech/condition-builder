import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";

const ErrorBoundaryBox = styled(Box)({
  position: "fixed",
  top: "0",
  left: "0",
  bottom: "0",
  right: "0",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
});

const StyledPaper = styled(Paper)({
  textAlign: "center",
  marginTop: "20%",
  marginLeft: "auto",
  marginRight: "auto",
  height: "200px",
  width: "300px",
});

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: string | Error | ErrorEvent;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: "",
    };
  }

  static getDerivedStateFromError(e: Error): ErrorBoundaryState {
    return { hasError: true, error: e };
  }

  componentDidMount(): void {
    window.addEventListener("error", this.handleError);
  }

  componentWillUnmount(): void {
    window.removeEventListener("error", this.handleError);
  }

  handleError = (event: ErrorEvent): void => {
    event.preventDefault();
    console.error(event.error);
    this.setState({
      hasError: true,
      error: new Error(event.message),
    });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <>
          <ErrorBoundaryBox>
            <StyledPaper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" component="h6">
                Oops Something went wrong....
              </Typography>
            </StyledPaper>
          </ErrorBoundaryBox>
          {this.props.children}
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
